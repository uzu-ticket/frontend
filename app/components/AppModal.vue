<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="app-modal-overlay"
        :class="{ 'app-modal-overlay--blur': backdropBlur }"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="title ? modalId + '-title' : undefined"
        @keydown.esc="handleClose"
        @mousedown.self="handleBackdropClick"
      >
        <Transition name="modal-panel">
          <div
            v-if="modelValue"
            class="app-modal-panel"
            :class="[sizeClasses[props.size], panelClass, noPadding ? 'app-modal-panel--no-pad' : '']"
            @click.stop
          >
            <!-- Optional header slot or title bar -->
            <div v-if="$slots.header || title || closable" class="app-modal-header">
              <slot name="header">
                <span v-if="title" :id="modalId + '-title'" class="app-modal-title">
                  {{ title }}
                </span>
              </slot>
              <button
                v-if="closable"
                type="button"
                class="app-modal-close"
                aria-label="Close modal"
                @click="handleClose"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Default slot (main content) -->
            <div :class="noPadding ? '' : 'app-modal-body'">
              <slot />
            </div>

            <!-- Footer slot -->
            <div v-if="$slots.footer" class="app-modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useId, watch, onUnmounted } from 'vue'

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface Props {
  /** v-model open state */
  modelValue: boolean
  /** Optional title rendered in the header bar */
  title?: string
  /** Show × close button */
  closable?: boolean
  /** Clicking the backdrop closes the modal */
  closeOnBackdrop?: boolean
  /** Panel width preset */
  size?: ModalSize
  /** Extra classes applied directly to the modal panel */
  panelClass?: string | string[] | Record<string, boolean>
  /** Apply backdrop blur */
  backdropBlur?: boolean
  /** Remove default body padding (use when you want full custom content) */
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  closable: true,
  closeOnBackdrop: true,
  size: 'md',
  panelClass: undefined,
  backdropBlur: false,
  noPadding: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  /** Fired when the modal closes for any reason */
  close: []
}>()

const modalId = useId()

const sizeClasses: Record<ModalSize, string> = {
  xs:   'app-modal-panel--xs',
  sm:   'app-modal-panel--sm',
  md:   'app-modal-panel--md',
  lg:   'app-modal-panel--lg',
  xl:   'app-modal-panel--xl',
  full: 'app-modal-panel--full',
}

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) handleClose()
}

// Prevent body scroll while open
watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ── Overlay ── */
.app-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}
.app-modal-overlay--blur {
  backdrop-filter: blur(4px);
}

/* ── Panel ── */
.app-modal-panel {
  position: relative;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22);
  width: 100%;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.app-modal-panel--no-pad {
  /* padding controlled by caller */
}

/* Sizes */
.app-modal-panel--xs   { max-width: 20rem; }
.app-modal-panel--sm   { max-width: 30rem; }
.app-modal-panel--md   { max-width: 36rem; }
.app-modal-panel--lg   { max-width: 48rem; }
.app-modal-panel--xl   { max-width: 64rem; }
.app-modal-panel--full { max-width: 100%; height: 100vh; border-radius: 0; }

/* ── Header ── */
.app-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 0;
  flex-shrink: 0;
}
.app-modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

/* ── Close button ── */
.app-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  margin-left: auto;
  transition: background 0.15s, color 0.15s;
}
.app-modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}
.app-modal-close:focus-visible {
  outline: 2px solid #3FD246;
  outline-offset: 2px;
}

/* ── Body ── */
.app-modal-body {
  padding: 1.5rem;
  flex: 1;
}

/* ── Footer ── */
.app-modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* ── Transitions ── */
/* Overlay fade */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Panel slide-up + scale */
.modal-panel-enter-active,
.modal-panel-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
</style>
