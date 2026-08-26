export interface ApiError {
  message: string | string[]
  status?: number
  errors?: Record<string, string[]>
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
