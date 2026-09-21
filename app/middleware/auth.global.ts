export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const { user, restoreSession } = useAuth()

  const isVerificationPage = to.path.startsWith('/auth/verify')
  const isAuthPage = to.path.startsWith('/auth')

  if (!user.value) {
    const ok = await restoreSession()
    if (!ok && !isAuthPage) {
      return navigateTo('/auth/signin')
    }
  }

  if (user.value && !user.value.isEmailVerified && !isVerificationPage) {
    return navigateTo(`/auth/verify-email?email=${encodeURIComponent(user.value.email)}`)
  }

  if (isAuthPage && !isVerificationPage) {
    if (user.value && user.value.isEmailVerified) {
      return navigateTo('/overview')
    }
    return
  }
})