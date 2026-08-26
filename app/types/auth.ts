export interface User {
  id: string
  email: string
  phone?: string
  fullName?: string
  city?: string
  isEmailVerified: boolean
  isPhoneVerified?: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  fullName?: string
  phone?: string
}

export interface ForgotPasswordDto {
  contact: string
  channel: 'email' | 'phone'
}

export interface ResetPasswordDto {
  contact: string
  channel: 'email' | 'phone'
  tokenOrCode: string
  password: string
}

export interface RequestEmailVerificationDto {
  email: string
}

export interface VerifyEmailDto {
  email: string
  token: string
}

export interface RequestOtpDto {
  email: string
}

export interface VerifyOtpDto {
  email: string
  code: string
}

export interface RefreshTokenDto {
  refreshToken: string
}

export interface EnableTwoFactorDto {
  secret: string
  code: string
}

export interface TwoFactorCodeDto {
  code: string
}
