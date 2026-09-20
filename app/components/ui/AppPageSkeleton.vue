<template>
  <div
    class="app-page-skeleton"
    :class="[`app-page-skeleton--${layout}`, className]"
  >
    <div v-if="showHeader" class="app-page-skeleton__header">
      <AppSkeleton
        variant="title"
        :width="headerWidth"
        :height="headerHeight"
      />
      <AppSkeleton
        v-if="headerLines > 1"
        variant="text"
        width="70%"
        height="0.8rem"
      />
    </div>

    <div v-if="showActions" class="app-page-skeleton__actions">
      <AppSkeleton
        v-for="action in actionCount"
        :key="action"
        variant="rectangle"
        :width="actionWidth"
        :height="actionHeight"
        :border-radius="actionRadius"
      />
    </div>

    <div
      v-if="layout === 'stats'"
      class="app-page-skeleton__grid app-page-skeleton__grid--stats"
    >
      <div v-for="n in statCards" :key="n" class="app-page-skeleton__card">
        <AppSkeleton variant="card" :height="cardHeight" />
      </div>
    </div>

    <div v-else-if="layout === 'table'" class="app-page-skeleton__table">
      <AppSkeleton variant="rectangle" width="100%" :height="tableHeight" />
      <div class="app-page-skeleton__rows">
        <AppSkeleton
          v-for="row in rows"
          :key="row"
          variant="text"
          width="100%"
          height="0.9rem"
        />
      </div>
    </div>

    <div v-else-if="layout === 'event'" class="app-page-skeleton__event">
      <AppSkeleton
        variant="rectangle"
        width="100%"
        height="180px"
        border-radius="1rem"
      />
      <div class="app-page-skeleton__event-body">
        <AppSkeleton variant="title" width="55%" height="1.5rem" />
        <AppSkeleton variant="text" width="80%" height="0.8rem" />
        <AppSkeleton variant="text" width="70%" height="0.8rem" />
        <div class="app-page-skeleton__event-actions">
          <AppSkeleton
            variant="rectangle"
            width="150px"
            height="42px"
            border-radius="0.75rem"
          />
          <AppSkeleton
            variant="rectangle"
            width="150px"
            height="42px"
            border-radius="0.75rem"
          />
        </div>
      </div>
    </div>

    <div v-else class="app-page-skeleton__list">
      <div v-for="n in rows" :key="n" class="app-page-skeleton__list-item">
        <AppSkeleton variant="text" width="100%" height="0.95rem" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSkeleton from "~/components/ui/AppSkeleton.vue";

interface Props {
  layout?: "default" | "stats" | "table" | "event";
  rows?: number;
  columns?: number;
  statCards?: number;
  showHeader?: boolean;
  showActions?: boolean;
  headerLines?: number;
  headerWidth?: string;
  headerHeight?: string;
  actionCount?: number;
  actionWidth?: string;
  actionHeight?: string;
  actionRadius?: string;
  cardHeight?: string;
  tableHeight?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  layout: "default",
  rows: 4,
  columns: 2,
  statCards: 4,
  showHeader: true,
  showActions: false,
  headerLines: 2,
  headerWidth: "45%",
  headerHeight: "1.4rem",
  actionCount: 2,
  actionWidth: "160px",
  actionHeight: "42px",
  actionRadius: "0.75rem",
  cardHeight: "120px",
  tableHeight: "180px",
  className: "",
});
</script>

<style scoped>
.app-page-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.app-page-skeleton__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-page-skeleton__actions,
.app-page-skeleton__event-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.app-page-skeleton__grid {
  display: grid;
  gap: 1rem;
}

.app-page-skeleton__grid--stats {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.app-page-skeleton__card,
.app-page-skeleton__list-item {
  width: 100%;
}

.app-page-skeleton__table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-page-skeleton__rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.app-page-skeleton__event {
  display: grid;
  grid-template-columns: 1.1fr 1.4fr;
  gap: 1.5rem;
  align-items: center;
}

.app-page-skeleton__event-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.app-page-skeleton__list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

@media (max-width: 1024px) {
  .app-page-skeleton__grid--stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .app-page-skeleton__event {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .app-page-skeleton__grid--stats {
    grid-template-columns: 1fr;
  }
}
</style>
