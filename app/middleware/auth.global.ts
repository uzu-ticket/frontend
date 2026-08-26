export default defineNuxtRouteMiddleware(async (to) => {
  const { user, isAuthenticated, restoreSession } = useAuth()

  const isAuthPage = to.path.startsWith('/auth')

  // Attempt session restoration if user profile is not loaded in state
  if (!user.value) {
    await restoreSession()
  }

  // If on authentication pages (/auth/signin, /auth/signup, etc.)
  if (isAuthPage) {
    if (isAuthenticated.value) {
      return navigateTo('/overview')
    }
    return
  }

  // Protected route check
  if (!isAuthenticated.value) {
    return navigateTo('/auth/signin')
  }
})
