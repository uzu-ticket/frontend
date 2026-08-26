export default defineNuxtPlugin(() => {
  const { instance, setAuthToken } = useApi()
  const router = useRouter()
  const refreshTokenCookie = useCookie<string | null>('refresh-token')

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config
  })

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const apiError = error as { response?: { status?: number; data?: { message?: string } } }
      if (apiError.response?.status === 401) {
        const refreshToken = refreshTokenCookie.value
        if (refreshToken) {
          try {
            const { data } = await instance.post('/auth/refresh', { refreshToken })
            const accessToken = data.data?.accessToken || data.accessToken
            const newRefreshToken = data.data?.refreshToken || data.refreshToken
            if (accessToken) {
              setAuthToken(accessToken)
              if (newRefreshToken) {
                refreshTokenCookie.value = newRefreshToken
              }
              return instance.request(error.config)
            }
          } catch {
            refreshTokenCookie.value = null
          }
        }
        await router.push('/auth/signin')
      }
      return Promise.reject(error)
    }
  )
})
