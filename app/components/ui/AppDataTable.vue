<template>
  <div class="custom-table-container">
    <div class="table-responsive">
      <table class="custom-table">
        <!-- Header -->
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width, textAlign: col.align || 'left' }"
              class="table-th"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <template v-if="paginatedItems && paginatedItems.length > 0">
            <tr
              v-for="(item, index) in paginatedItems"
              :key="item.id || index"
              class="table-tr"
              :class="{ 'table-tr--clickable': clickableRows }"
              @click="handleRowClick(item, index)"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                :style="{ textAlign: col.align || 'left' }"
                class="table-td"
              >
                <!-- Custom Slot for Column -->
                <slot :name="`cell-${col.key}`" :item="item" :value="item[col.key]">
                  {{ item[col.key] }}
                </slot>
              </td>
            </tr>
          </template>

          <!-- Empty Row fallback -->
          <tr v-else class="table-tr-empty">
            <td :colspan="columns.length" class="empty-td">
              <slot name="empty">
                <span class="empty-text">No data found</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer Row with Pagination -->
    <div class="table-footer-row">
      <!-- Showing X of Y info -->
      <div class="footer-info">
        <slot name="footer" :total="items.length" :current-page="currentPage">
          <span class="showing-text">Showing {{ showingFrom }} - {{ showingTo }} of {{ items.length }} events</span>
        </slot>
      </div>

      <!-- Pagination Buttons -->
      <div v-if="totalPages > 1" class="pagination-controls">
        <button
          class="page-btn page-btn--nav"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="page-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span>Prev</span>
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          class="page-btn page-btn--num"
          :class="{ 'page-btn--active': currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>

        <button
          class="page-btn page-btn--nav"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="page-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface TableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[]
    items: Record<string, any>[]
    pageSize?: number
    clickableRows?: boolean
  }>(),
  {
    pageSize: 5,
    clickableRows: false,
  }
)

const emit = defineEmits<{
  'row-click': [item: Record<string, any>, index: number]
}>()

function handleRowClick(item: Record<string, any>, index: number) {
  if (props.clickableRows) {
    emit('row-click', item, index)
  }
}

const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(props.items.length / props.pageSize) || 1
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return props.items.slice(start, start + props.pageSize)
})

const showingFrom = computed(() => {
  if (props.items.length === 0) return 0
  return (currentPage.value - 1) * props.pageSize + 1
})

const showingTo = computed(() => {
  const to = currentPage.value * props.pageSize
  return to > props.items.length ? props.items.length : to
})
</script>

<style scoped>
.custom-table-container {
  width: 100%;
  position: relative;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;
}

/* Header */
.table-th {
  padding: 0.85rem 1rem;
  font-size: 0.725rem;
  font-weight: 800;
  color: #6b7280;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
  background: #ffffff;
}

/* Rows & Cells */
.table-tr {
  transition: background 0.15s ease;
}

.table-tr--clickable {
  cursor: pointer;
}

.table-tr:hover {
  background: #f9fafb;
}

.table-td {
  padding: 1.1rem 1rem;
  font-size: 0.85rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  position: relative;
}

.table-tr:last-child .table-td {
  border-bottom: none;
}

/* Empty State */
.empty-td {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.empty-text {
  font-size: 0.875rem;
  font-weight: 600;
}

/* Footer Row */
.table-footer-row {
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.showing-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  height: 2.1rem;
  min-width: 2.1rem;
  padding: 0 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #0E2615;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn--active {
  background: #3FD246;
  border-color: #3FD246;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(63, 210, 70, 0.25);
}

.page-btn--active:hover {
  background: #34c03b !important;
  color: #ffffff !important;
}

.page-icon {
  width: 0.9rem;
  height: 0.9rem;
}
</style>
