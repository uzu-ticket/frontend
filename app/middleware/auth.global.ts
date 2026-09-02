export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const { user, restoreSession } = useAuth()

  const isAuthPage = to.path.startsWith('/auth')

  if (!user.value) {
    const ok = await restoreSession()
    if (!ok && !isAuthPage) {
      return navigateTo('/auth/signin')
    }
  }

  if (isAuthPage) {
    if (user.value) {
      return navigateTo('/overview')
    }
    return
  }
})