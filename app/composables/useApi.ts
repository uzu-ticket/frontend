import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

let sharedInstance: AxiosInstance | null = null

export const useApi = () => {
  const config = useRuntimeConfig()

  if (!sharedInstance) {
    sharedInstance = axios.create({
      baseURL: config.public.apiBase,
      withCredentials: true,
    })
  }

  const setAuthToken = (token: string | null) => {
    if (token) {
      sharedInstance!.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete sharedInstance!.defaults.headers.common['Authorization']
    }
  }

  return {
    instance: sharedInstance!,
    setAuthToken,
    apiBase: config.public.apiBase,
  }
}
