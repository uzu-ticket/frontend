import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

function safeGetCookie<T>(name: string): T | null {
  try {
    const val = useCookie<T | null>(name).value
    if (val !== null && val !== undefined) return val
  } catch {
    void 0
  }
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match[2])) as T
      } catch {
        return decodeURIComponent(match[2]) as unknown as T
      }
    }
  }
  return null
}

function safeSetCookie<T>(name: string, val: T | null) {
  try {
    useCookie<T | null>(name).value = val
  } catch {
    void 0
  }
  if (typeof document !== 'undefined') {
    if (val === null) {
      document.cookie = `${name}=; Max-Age=0; path=/`
    } else {
      const strVal = typeof val === 'string' ? val : JSON.stringify(val)
      document.cookie = `${name}=${encodeURIComponent(strVal)}; path=/; max-age=${60 * 60 * 24 * 30}`
    }
  }
}

export const useApi = () => {
  const config = useRuntimeConfig()

  const instance: AxiosInstance = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
  })

  // Dynamic request interceptor to always attach latest Bearer token & active org header
  instance.interceptors.request.use((reqConfig: InternalAxiosRequestConfig) => {
    const token = safeGetCookie<string>('auth-token')
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`
    }
    const activeOrg = safeGetCookie<{ id: string }>('uzu-active-org')
    if (activeOrg?.id) {
      reqConfig.headers['x-organization-id'] = activeOrg.id
    }
    return reqConfig
  })

  // Response interceptor for automatic 401 refresh retry
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/refresh')
      ) {
        originalRequest._retry = true
        const storedRefreshToken = safeGetCookie<string>('refresh-token')
        if (storedRefreshToken) {
          try {
            const refreshRes = await axios.post(
              `${config.public.apiBase}/auth/refresh`,
              { refreshToken: storedRefreshToken },
              { withCredentials: true },
            )
            const newAccessToken =
              refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken
            const newRefreshToken =
              refreshRes.data?.data?.refreshToken || refreshRes.data?.refreshToken

            if (newAccessToken) {
              safeSetCookie('auth-token', newAccessToken)
              if (newRefreshToken) safeSetCookie('refresh-token', newRefreshToken)

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
              return instance(originalRequest)
            }
          } catch {
            safeSetCookie('auth-token', null)
            safeSetCookie('refresh-token', null)
          }
        }
      }
      return Promise.reject(error)
    },
  )

  const setAuthToken = (token: string | null) => {
    safeSetCookie('auth-token', token)
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete instance.defaults.headers.common['Authorization']
    }
  }

  return {
    instance,
    setAuthToken,
    apiBase: config.public.apiBase,
  }
}
