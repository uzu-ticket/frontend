import { ref } from 'vue'

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type?: 'success' | 'info' | 'warning' | 'error'
}

const toasts = ref<ToastMessage[]>([])

export function useToast() {
  function show(toast: Omit<ToastMessage, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastMessage = { id, type: 'success', ...toast }
    toasts.value.push(newToast)

    setTimeout(() => {
      remove(id)
    }, 3500)
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    show,
    remove,
  }
}
