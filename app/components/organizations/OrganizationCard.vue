<template>
  <div class="org-card" :class="{ 'org-card--active': isActive }">
    <!-- Top Header: Initials Badge + Name & Role -->
    <div class="org-card-header">
      <div class="org-badge" :style="{ backgroundColor: badgeBg }">
        {{ initials }}
      </div>
      <div class="org-info">
        <h3 class="org-name">{{ name }}</h3>
        <span class="org-role">{{ role }}</span>
      </div>
      <div v-if="isActive" class="active-indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="active-check"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span class="active-label">Active</span>
      </div>

      <button
        v-else
        class="org-go-button"
        type="button"
        aria-label="Open organization"
        @click.stop="handleOpenDashboard"
      >
        <img src="/arrow-out.png" alt="Open organization" class="org-go-icon" />
      </button>
    </div>

    <!-- Member Avatars Stack -->
    <div v-if="visibleMembers.length > 0" class="org-members-stack">
      <div
        v-for="(member, index) in visibleMembers"
        :key="`${member.name || 'member'}-${index}`"
        class="avatar-pill-wrap"
      >
        <div class="avatar-pill">
          <img
            v-if="member.imageUrl"
            :src="member.imageUrl"
            :alt="member.name || 'Member avatar'"
            class="avatar-img"
          />
          <span
            v-else
            class="avatar-fallback"
            :style="{
              background: member.color || '#EAFBF0',
              color: member.textColor || '#0E2615',
            }"
          >
            {{ member.initials || "•" }}
          </span>
        </div>

        <div
          v-if="index === 0 && isOwnerVisible"
          class="owner-badge"
          aria-label="Organization owner"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M7 18V9.5L12 5l5 4.5V18" />
            <path d="M9 18v-5h6v5" />
            <path d="M12 5V3" />
          </svg>
        </div>
      </div>

      <div v-if="extraMembersCount > 0" class="extra-members-badge">
        +{{ extraMembersCount }}
      </div>
    </div>

    <!-- Metrics Row -->
    <div class="org-metrics">
      <div class="metric-item">
        <span class="metric-value">{{ eventsCount }}</span>
        <span class="metric-label"
          >Event{{ eventsCount === 1 ? "" : "s" }}</span
        >
      </div>
      <div class="metric-item">
        <span class="metric-value">{{ membersCount }}</span>
        <span class="metric-label"
          >Member{{ membersCount === 1 ? "" : "s" }}</span
        >
      </div>
    </div>

    <!-- Action Button -->
    <button class="btn-open-dashboard" @click="handleOpenDashboard">
      Open Dashboard
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useOrgState } from "~/composables/useOrgState";

interface MemberAvatarItem {
  name?: string;
  imageUrl?: string | null;
  initials?: string;
  color?: string;
  textColor?: string;
}

interface Props {
  id?: string | number;
  name: string;
  role?: string;
  initials: string;
  badgeBg?: string;
  eventsCount: number;
  membersCount: number;
  ownerProfile?: MemberAvatarItem;
  memberAvatars?: string[];
  memberProfiles?: MemberAvatarItem[];
  extraMembersCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  role: "Owner",
  badgeBg: "#0E2615",
  memberAvatars: () => [],
  memberProfiles: () => [],
  extraMembersCount: 0,
});

const router = useRouter();
const { setActiveOrg, activeOrgId } = useOrgState();

const visibleMembers = computed(() => {
  const seed: MemberAvatarItem[] = [];

  if (props.ownerProfile) {
    seed.push(props.ownerProfile);
  }

  const additional = (
    props.memberProfiles?.length
      ? props.memberProfiles
      : props.memberAvatars.map((imageUrl, index) => ({
          name: `Member ${index + 1}`,
          imageUrl,
          initials: "•",
        }))
  ).filter(
    (member) =>
      !props.ownerProfile ||
      !member.name ||
      member.name !== props.ownerProfile.name,
  );

  seed.push(...additional);

  return seed.slice(0, 4);
});

const extraMembersCount = computed(() => {
  const totalMembers =
    (props.ownerProfile ? 1 : 0) +
    (props.memberProfiles?.length
      ? props.memberProfiles.length
      : props.memberAvatars.length);
  return Math.max(totalMembers - 4, 0) + (props.extraMembersCount ?? 0);
});

const isOwnerVisible = computed(
  () => !!props.ownerProfile || /owner/i.test(props.role || ""),
);
const isActive = computed(() => String(props.id) === activeOrgId.value);

function handleOpenDashboard() {
  if (props.id) {
    setActiveOrg({
      id: String(props.id),
      name: props.name,
      initials: props.initials,
    });
  }
  router.push("/overview");
}
</script>

<style scoped>
.org-card {
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #eef2ee;
  padding: 1.35rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.org-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border-color: #e2f9e4;
  transform: translateY(-2px);
}

/* Header */
.org-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.org-badge {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.45rem;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.org-info {
  display: flex;
  flex-direction: column;
}

.org-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.15rem;
  line-height: 1.2;
}

.org-role {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Active Organization Highlight */
.org-card--active {
  border-color: #3fd246;
  box-shadow:
    0 0 0 3px rgba(63, 210, 70, 0.25),
    0 4px 20px rgba(0, 0, 0, 0.06);
}
.active-indicator {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #3fd246;
  background: #ecfdf5;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
}
.active-check {
  width: 0.9rem;
  height: 0.9rem;
  color: #3fd246;
}

.org-go-button {
  margin-left: auto;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  border: none;
  background: transparent;
  color: #3fd246;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}

.org-go-button:hover {
  background: transparent;
  opacity: 0.9;
}

.org-go-icon {
  width: 0.95rem;
  height: 0.95rem;
  display: block;
}

/* Members Stack */
.org-members-stack {
  display: flex;
  align-items: center;
  min-height: 2rem;
  margin-bottom: 1.25rem;
}

.avatar-pill-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-pill {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border: 2px solid #ffffff;
  overflow: hidden;
  margin-right: -0.45rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  background: #eafbf0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.owner-badge {
  position: absolute;
  right: -0.15rem;
  bottom: -0.15rem;
  width: 0.82rem;
  height: 0.82rem;
  border-radius: 9999px;
  border: 2px solid #ffffff;
  background: #0e2615;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(14, 38, 21, 0.18);
}

.owner-badge svg {
  width: 0.42rem;
  height: 0.42rem;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.extra-members-badge {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: #e8f9e9;
  border: 2px solid #ffffff;
  color: #3fd246;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Metrics */
.org-metrics {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.35rem;
}

.metric-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0e2615;
  line-height: 1.2;
}

.metric-label {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.2;
}

/* Action Button */
.btn-open-dashboard {
  width: 100%;
  padding: 0.6rem;
  background: #ffffff;
  border: 1.5px solid #dcfce7;
  color: #3fd246;
  font-weight: 700;
  font-size: 0.825rem;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-open-dashboard:hover {
  background: #f0fdf1;
  border-color: #3fd246;
}
</style>
