import type { User } from '~/types/auth'
import type { ApiError } from '~/types/common'
import { useOrgState } from '~/composables/useOrgState'

interface TokenPair {
  accessToken: string
  refreshToken: string
}

interface AuthResponse {
  accessToken?: string
  refreshToken?: string
  data?: TokenPair
  message?: string
}

function extractTokenPair(res: AuthResponse): TokenPair {
  if (res.data && res.data.accessToken) {
    return { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
  }
  if (res.accessToken) {
    return { accessToken: res.accessToken, refreshToken: res.refreshToken as string }
  }
  throw new Error('Invalid response format: missing tokens')
}

function extractErrorMessage(e: unknown, fallback: string): string {
  const apiError = e as {
    response?: {
      data?: ApiError | { message?: string | string[]; errors?: Record<string, string[]> }
    }
    message?: string
  }
  const data = apiError?.response?.data
  if (data?.message) {
    return Array.isArray(data.message)
      ? data.message.join(' ')
      : data.message
  }
  if (data?.errors) {
    return Object.values(data.errors).flat().join(', ')
  }
  if (apiError?.message) {
    return apiError.message
  }
  return fallback
}

function computeInitials(user: User | null): string {
  if (!user) return ''
  const name = user.fullName?.trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0][0].toUpperCase()
  }
  if (user.email) return user.email.slice(0, 2).toUpperCase()
  return ''
}

export const useAuth = () => {
  const router = useRouter()
  const { instance, setAuthToken } = useApi()

  const accessToken = useCookie<string | null>('auth-token', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  const refreshTokenCookie = useCookie<string | null>('refresh-token', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  const user = useState<User | null>('auth:user', () => null)
  const loading = useState<boolean>('auth:loading', () => false)
  const error = useState<string | null>('auth:error', () => null)

  const isAuthenticated = computed(() => !!user.value)
  const displayName = computed(() => user.value?.fullName || user.value?.email || '')
  const userInitials = computed(() => computeInitials(user.value))

  if (accessToken.value) {
    setAuthToken(accessToken.value)
  }

  function persistTokens(tokens: TokenPair) {
    accessToken.value = tokens.accessToken
    refreshTokenCookie.value = tokens.refreshToken
    setAuthToken(tokens.accessToken)
  }

  async function fetchUser() {
    if (!accessToken.value) {
      user.value = null
      return null
    }
    try {
      loading.value = true
      error.value = null
      const res = await instance.get<User>('/users/me')
      user.value = res.data
      await useOrgState().loadOrganizations()
      return res.data
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to fetch user')
      throw e
    } finally {
      loading.value = false
    }
  }

  async function restoreSession(): Promise<boolean> {
    if (!accessToken.value) return false
    try {
      await fetchUser()
      return true
    } catch {
      try {
        await refresh()
        await fetchUser()
        return true
      } catch {
        return false
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post<AuthResponse>('/auth/login', {
        email,
        password,
      })
      const tokens = extractTokenPair(res.data)
      persistTokens(tokens)
      await fetchUser()
      return tokens
    } catch (e) {
      error.value = extractErrorMessage(e, 'Login failed')
      throw e
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, fullName?: string, phone?: string) => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post<AuthResponse>('/auth/register', {
        email,
        password,
        fullName,
        phone,
      })
      const tokens = extractTokenPair(res.data)
      persistTokens(tokens)
      await fetchUser()
      return tokens
    } catch (e) {
      error.value = extractErrorMessage(e, 'Registration failed')
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (accessToken.value) await instance.post('/auth/logout')
    } catch {
      // ignore logout errors
    } finally {
      accessToken.value = null
      refreshTokenCookie.value = null
      setAuthToken(null)
      user.value = null
      useOrgState().clearActiveOrg()
      await router.push('/auth/signin')
    }
  }

  const refresh = async () => {
    const storedRefreshToken = refreshTokenCookie.value
    if (!storedRefreshToken) throw new Error('No refresh token')
    try {
      const res = await instance.post<AuthResponse>('/auth/refresh', {
        refreshToken: storedRefreshToken,
      })
      const tokens = extractTokenPair(res.data)
      persistTokens(tokens)
      return tokens
    } catch (e) {
      accessToken.value = null
      refreshTokenCookie.value = null
      setAuthToken(null)
      throw e
    }
  }

  const requestOtp = async (email: string) => {
    try {
      loading.value = true
      error.value = null
      await instance.post('/auth/otp/request', { email })
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to send OTP')
      throw e
    } finally {
      loading.value = false
    }
  }

  const verifyOtp = async (email: string, code: string) => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post<AuthResponse>('/auth/otp/verify', {
        email,
        code,
      })
      const tokens = extractTokenPair(res.data)
      persistTokens(tokens)
      await fetchUser()
      return tokens
    } catch (e) {
      error.value = extractErrorMessage(e, 'Invalid OTP')
      throw e
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (contact: string, channel: 'email' | 'phone') => {
    try {
      loading.value = true
      error.value = null
      const payload: Record<string, unknown> = { channel }
      if (channel === 'email') {
        payload.email = contact
      } else {
        payload.phone = contact
      }
      const res = await instance.post<{ message: string; devToken?: string }>('/auth/password/forgot', payload)
      return res.data
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to send reset instructions')
      throw e
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (contact: string, channel: 'email' | 'phone', tokenOrCode: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      const payload: Record<string, unknown> = { tokenOrCode, password }
      if (channel === 'email') {
        payload.email = contact
      } else {
        payload.phone = contact
      }
      await instance.post('/auth/password/reset', payload)
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to reset password')
      throw e
    } finally {
      loading.value = false
    }
  }

  const requestEmailVerification = async (email: string) => {
    try {
      loading.value = true
      error.value = null
      await instance.post('/auth/verify-email/request', { email })
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to send verification email')
      throw e
    } finally {
      loading.value = false
    }
  }

  const verifyEmail = async (email: string, token: string) => {
    try {
      loading.value = true
      error.value = null
      await instance.post('/auth/verify-email/verify', { email, token })
    } catch (e) {
      error.value = extractErrorMessage(e, 'Email verification failed')
      throw e
    } finally {
      loading.value = false
    }
  }

  const setupTwoFactor = async () => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post('/auth/2fa/setup')
      return res.data.data
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to setup 2FA')
      throw e
    } finally {
      loading.value = false
    }
  }

  const enableTwoFactor = async (secret: string, code: string) => {
    try {
      loading.value = true
      error.value = null
      await instance.post('/auth/2fa/enable', { secret, code })
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to enable 2FA')
      throw e
    } finally {
      loading.value = false
    }
  }

  const disableTwoFactor = async (code: string) => {
    try {
      loading.value = true
      error.value = null
      await instance.post('/auth/2fa/disable', { code })
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to disable 2FA')
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    displayName,
    userInitials,
    login,
    register,
    logout,
    refresh,
    fetchUser,
    restoreSession,
    requestOtp,
    verifyOtp,
    forgotPassword,
    resetPassword,
    requestEmailVerification,
    verifyEmail,
    setupTwoFactor,
    enableTwoFactor,
    disableTwoFactor,
  }
}
