<template>
  <div class="otp-container" @paste="handlePaste">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      :ref="(el) => (inputRefs[index] = el as HTMLInputElement)"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="digit"
      class="otp-box"
      :class="{ 'otp-box--active': activeIndex === index || digit !== '' }"
      @input="handleInput(index, $event)"
      @keydown="handleKeyDown(index, $event)"
      @focus="activeIndex = index"
      @blur="activeIndex = -1"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  length?: number
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [value: string]
}>()

const digits = ref<string[]>(Array(props.length).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])
const activeIndex = ref(-1)

// Initialize from v-model if present
watch(
  () => props.modelValue,
  (val) => {
    if (val !== digits.value.join('')) {
      const arr = val.split('').slice(0, props.length)
      while (arr.length < props.length) arr.push('')
      digits.value = arr
    }
  },
  { immediate: true },
)

function updateValue() {
  const code = digits.value.join('')
  emit('update:modelValue', code)
  if (code.length === props.length && !digits.value.includes('')) {
    emit('complete', code)
  }
}

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const val = target.value.replace(/\D/g, '').slice(-1)
  digits.value[index] = val
  updateValue()

  if (val && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

function handleKeyDown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      digits.value[index - 1] = ''
      inputRefs.value[index - 1]?.focus()
      updateValue()
    } else {
      digits.value[index] = ''
      updateValue()
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, props.length) || ''
  if (!pasted) return

  const arr = pasted.split('')
  for (let i = 0; i < props.length; i++) {
    digits.value[i] = arr[i] || ''
  }
  updateValue()
  const nextFocusIndex = Math.min(pasted.length, props.length - 1)
  inputRefs.value[nextFocusIndex]?.focus()
}

onMounted(() => {
  inputRefs.value[0]?.focus()
})
</script>

<style scoped>
.otp-container {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
}

.otp-box {
  width: 3.25rem;
  height: 3.75rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0E2615;
  background-color: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.15s ease;
  caret-color: #3FD246;
}

.otp-box:focus,
.otp-box--active {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}

@media (max-width: 480px) {
  .otp-container {
    gap: 0.5rem;
  }
  .otp-box {
    width: 2.75rem;
    height: 3.25rem;
    font-size: 1.25rem;
  }
}
</style>
