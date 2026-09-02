export default defineNuxtPlugin(async () => {
  const { user, restoreSession } = useAuth()
  if (!user.value) {
    await restoreSession()
  }
})