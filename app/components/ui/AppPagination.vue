<template>
  <div class="table-pagination-footer">
    <div class="pagination-info">
      Showing {{ showingFrom }}–{{ showingTo }} of {{ totalItems }}
    </div>
    <div class="pagination-controls">
      <button
        type="button"
        class="page-btn page-prev-btn"
        :disabled="currentPage <= 1"
        @click="$emit('update:modelValue', currentPage - 1)"
      >
        &lt;
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        type="button"
        class="page-btn"
        :class="{ 'page-btn--active': currentPage === page }"
        @click="$emit('update:modelValue', page)"
      >
        {{ page }}
      </button>
      <button
        type="button"
        class="page-btn page-next-btn"
        :disabled="currentPage >= totalPages"
        @click="$emit('update:modelValue', currentPage + 1)"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  totalPages: number
  totalItems: number
  pageSize?: number
}>()

defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const currentPage = computed(() => props.modelValue)
const pageSize = computed(() => props.pageSize ?? 10)

const showingFrom = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.modelValue - 1) * pageSize.value + 1
})

const showingTo = computed(() => {
  return Math.min(props.modelValue * pageSize.value, props.totalItems)
})

const visiblePages = computed<(number | string)[]>(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5
  const total = props.totalPages
  const current = props.modelValue

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})
</script>

<style scoped>
.table-pagination-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.pagination-info {
  font-size: 0.82rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: #3FD246;
  color: #16a34a;
}

.page-btn--active {
  background: #e0f9e3;
  border: 1.5px solid #3FD246;
  color: #16a34a;
  font-weight: 800;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-next-btn {
  font-size: 0.9rem;
}

.page-prev-btn {
  font-size: 0.9rem;
}
</style>
