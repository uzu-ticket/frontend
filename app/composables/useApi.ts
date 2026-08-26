import axios, { type AxiosInstance } from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('auth-token')

  const instance: AxiosInstance = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
  })

  if (tokenCookie.value) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${tokenCookie.value}`
  }

  const setAuthToken = (token: string | null) => {
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
