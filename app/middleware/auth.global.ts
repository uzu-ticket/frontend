export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, restoreSession } = useAuth()

  const isAuthPage = to.path.startsWith('/auth')

  if (isAuthPage) {
    if (isAuthenticated.value) {
      return navigateTo('/overview')
    }
    if (await restoreSession()) {
      return navigateTo('/overview')
    }
    return
  }

  if (!isAuthenticated.value) {
    const restored = await restoreSession()
    if (!restored) {
      return navigateTo('/auth/signin')
    }
  }
})
