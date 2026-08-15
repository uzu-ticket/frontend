import { ref } from 'vue'

const hasActiveOrg = ref(true) // Toggle to switch between Getting Started & Data state
const activeOrgName = ref('Zeenom Events')
const activeOrgInitials = ref('ZE')

export function useOrgState() {
  function toggleOrgState() {
    hasActiveOrg.value = !hasActiveOrg.value
  }

  return {
    hasActiveOrg,
    activeOrgName,
    activeOrgInitials,
    toggleOrgState,
  }
}
