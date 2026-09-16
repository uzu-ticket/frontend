<template>
  <div class="invite-initial-container">
    <div v-if="isSearchMode" class="search-mode">
      <div class="search-mode-header">
        <h2 class="search-mode-title">Invite Team Members</h2>
        <p class="search-mode-subtitle">
          Add your team members to start collaborating
        </p>
      </div>

      <div class="member-search-toolbar">
        <div class="member-search-input-wrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="member-search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            class="member-search-input"
            type="text"
            placeholder="Search by name or email"
            autocomplete="off"
          />
          <AppSelect
            v-model="selectedRole"
            class="role-picker"
            :options="roleOptions"
            aria-label="Invite role"
            placeholder="Select role"
          />
        </div>
        <AppButton
          class="invite-member-button"
          type="button"
          :disabled="!searchQuery.trim()"
          @click="inviteMember"
        >
          <span class="plus-mark">+</span> Invite
        </AppButton>
      </div>

      <section class="member-section">
        <div v-if="invitedMembers.length" class="member-list">
          <div
            v-for="member in invitedMembers"
            :key="member.email"
            class="member-row"
          >
            <span class="member-avatar">{{ member.initials }}</span>
            <span class="member-email">{{ member.email }}</span>
            <span class="member-role" :class="`member-role--${member.role}`">{{
              member.role
            }}</span>
            <span class="member-date">{{ member.date }}</span>
            <button type="button" class="edit-role-button">
              Edit Role <span>›</span>
            </button>
          </div>
        </div>
        <p v-else class="empty-members">No team members invited yet.</p>
      </section>

      <section class="member-section pending-section">
        <h3 class="member-section-title">Pending Invitation</h3>
        <div v-if="pendingMembers.length" class="member-list">
          <div
            v-for="member in pendingMembers"
            :key="member.email"
            class="member-row"
          >
            <span class="member-avatar">{{ member.initials }}</span>
            <span class="member-email">{{ member.email }}</span>
            <span class="member-role" :class="`member-role--${member.role}`">{{
              member.role
            }}</span>
            <span class="member-date">{{ member.date }}</span>
            <button
              type="button"
              class="uninvite-button"
              @click="removePending(member.email)"
            >
              <span>−</span> Uninvite
            </button>
          </div>
        </div>
        <p v-else class="empty-members">No pending invitations.</p>
      </section>

      <div class="search-mode-footer">
        <button
          type="button"
          class="footer-back-button"
          @click="isSearchMode = false"
        >
          <span>←</span> Back
        </button>
        <AppButton
          type="button"
          @click="
            $emit(
              'send-invite',
              pendingMembers.map(({ email, role }) => ({ email, role })),
            )
          "
          >Complete <span>→</span></AppButton
        >
      </div>
    </div>

    <template v-else>
      <!-- Top Back Link -->
      <div class="back-row">
        <button class="btn-back-link" @click="handleBack">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="back-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <!-- Centered Card Content -->
      <div class="invite-content">
        <!-- 3 Overlapping Avatars Header Visual -->
        <div class="avatars-row">
          <div class="avatar-circle avatar-circle--1">
            <div class="avatar-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="avatar-svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
          </div>
          <div class="avatar-circle avatar-circle--2">
            <div class="avatar-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="avatar-svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
          </div>
          <div class="avatar-circle avatar-circle--3">
            <div class="avatar-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="avatar-svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="visual-divider" />

        <!-- Title & Subtitle -->
        <h2 class="invite-title">Invite Team Members</h2>
        <p class="invite-subtitle">
          Add your team members to start collaborating
        </p>

        <!-- Search Input Trigger -->
        <div class="search-trigger-box" @click="openSearchMode">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span class="search-placeholder">Search by name or email</span>
        </div>

        <!-- Divider label -->
        <div class="or-divider">
          <span>Or share invite link</span>
        </div>

        <!-- Share Link Box -->
        <div class="share-link-card" @click="copyLink">
          <div class="link-icon-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="link-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <span class="link-text">{{
            copied ? "Link Copied to Clipboard!" : "Or share invite link"
          }}</span>
        </div>

        <!-- Submit Button -->
        <div class="action-footer">
          <AppButton
            id="btn-send-invite"
            type="button"
            :loading="props.isSubmitting"
            @click="
              $emit(
                'send-invite',
                pendingMembers.map(({ email, role }) => ({ email, role })),
              )
            "
          >
            Send Invite
          </AppButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppButton from "~/components/AppButton.vue";
import AppSelect from "~/components/ui/AppSelect.vue";

const props = defineProps<{
  isSubmitting?: boolean;
}>();

interface InviteMember {
  email: string;
  role: string;
  initials: string;
  date: string;
}

const emit = defineEmits<{
  back: [];
  "start-search": [];
  "send-invite": [members: Array<{ email: string; role: string }>];
}>();

const router = useRouter();
const copied = ref(false);
const isSearchMode = ref(false);
const searchQuery = ref("");
const selectedRole = ref("admin");
const invitedMembers = ref<InviteMember[]>([]);
const pendingMembers = ref<InviteMember[]>([]);
const roleOptions = [
  { value: "admin", label: "Admin", icon: "●", iconColor: "#2196e8" },
  { value: "sales", label: "Sales", icon: "●", iconColor: "#ff9f0a" },
  { value: "promoter", label: "Promoter", icon: "●", iconColor: "#f238a8" },
  {
    value: "ticket_scanner",
    label: "Ticket Scanner",
    icon: "●",
    iconColor: "#2abda9",
  },
  {
    value: "customer_support",
    label: "Customer Support",
    icon: "●",
    iconColor: "#11b74f",
  },
  { value: "marketing", label: "Marketing", icon: "●", iconColor: "#6562eb" },
];

function handleBack() {
  emit("back");
}

function openSearchMode() {
  isSearchMode.value = true;
}

function inviteMember() {
  const email = searchQuery.value.trim();
  if (!email) return;

  const username = email.split("@")[0] ?? "";
  const nameParts = username.split(/[._-]+/).filter(Boolean);
  const initials =
    nameParts.length > 1
      ? nameParts
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("")
      : username.slice(0, 2).toUpperCase();

  pendingMembers.value.push({
    email,
    role: selectedRole.value,
    initials: initials || "U",
    date: "Pending",
  });
  searchQuery.value = "";
}

function removePending(email: string) {
  pendingMembers.value = pendingMembers.value.filter(
    (member) => member.email !== email,
  );
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(
      "https://uzuticket.com/org/invite/token-12389",
    );
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {}
}
</script>

<style scoped>
.invite-initial-container {
  width: 100%;
}

.back-row {
  margin-bottom: 1.5rem;
}

.btn-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-back-link:hover {
  color: #0e2615;
}
.back-icon {
  width: 1rem;
  height: 1rem;
}

/* Centered Content */
.invite-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 540px;
  margin: 0 auto;
  padding: 1.5rem 0 2rem;
}

/* 3 Overlapping Avatars */
.avatars-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.75rem;
}

.avatar-circle {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  padding: 4px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  margin-left: -1.25rem;
  transition: transform 0.2s ease;
}

.avatar-circle:first-child {
  margin-left: 0;
}

.avatar-circle--1 {
  background: #f3f4f6;
}
.avatar-circle--2 {
  background: #fce7f3;
}
.avatar-circle--3 {
  background: #fee2e2;
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #9ca3af;
}

.avatar-circle--1 .avatar-inner {
  background: #cbd5e1;
  color: #475569;
}
.avatar-circle--2 .avatar-inner {
  background: #fbcfe8;
  color: #db2777;
}
.avatar-circle--3 .avatar-inner {
  background: #fecaca;
  color: #dc2626;
}

.avatar-svg {
  width: 3.25rem;
  height: 3.25rem;
}

.visual-divider {
  width: 100%;
  max-width: 280px;
  height: 1px;
  background: #e5e7eb;
  margin-bottom: 1.75rem;
}

/* Title & Subtitle */
.invite-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #3fd246;
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
}

.invite-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.75rem;
}

/* Search Trigger Box */
.search-trigger-box {
  width: 100%;
  max-width: 440px;
  padding: 0.75rem 1.25rem;
  background: #ebf1f6;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 1.75rem;
}

.search-trigger-box:hover {
  background: #e2e9f0;
}

.search-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #9ca3af;
}

.search-placeholder {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Or Divider */
.or-divider {
  margin-bottom: 1.25rem;
  font-size: 0.825rem;
  font-weight: 600;
  color: #6b7280;
}

/* Share Link Card */
.share-link-card {
  width: 100%;
  max-width: 440px;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 2.25rem;
}

.share-link-card:hover {
  border-color: #3fd246;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.1);
}

.link-icon-box {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.6rem;
  background: #0e2615;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.link-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

/* Footer Action */
.action-footer {
  width: 100%;
  max-width: 440px;
}

.btn-send-invite {
  width: 100%;
  padding: 0.85rem;
  background: #3fd246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}

.btn-send-invite:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.search-mode {
  width: 100%;
  padding: 0.25rem 1.9rem 1.25rem;
}

.search-mode-header {
  margin-bottom: 1.75rem;
}

.search-mode-title {
  margin: 0 0 0.35rem;
  color: #0e2615;
  font-size: 1.05rem;
  font-weight: 800;
}

.search-mode-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.8rem;
}

.member-search-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.member-search-input-wrap {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.1rem 0.5rem 0.1rem 0.9rem;
  background: #ebf1f6;
  border: 1px solid #d4dee9;
  border-radius: 999px;
}

.member-search-input-wrap:focus-within {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.member-search-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #64748b;
}

.member-search-input {
  min-width: 0;
  flex: 1;
  padding: 0.68rem 0;
  background: transparent;
  border: 0;
  outline: 0;
  color: #334155;
  font-size: 0.8rem;
}

.role-select {
  min-width: 7.5rem;
  padding: 0.55rem 1.75rem 0.55rem 1.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #ffffff;
  color: #334155;
  font-size: 0.75rem;
  outline: 0;
}

.role-picker {
  width: 8.5rem;
  flex: 0 0 8.5rem;
}

.role-picker :deep(.select-trigger) {
  min-height: 2.45rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
}

.role-picker :deep(.select-value) {
  font-size: 0.75rem;
}

.invite-member-button {
  min-width: 6.3rem;
  border-radius: 999px !important;
  padding: 0.7rem 1.1rem !important;
  font-size: 0.78rem !important;
}

.plus-mark {
  margin-right: 0.35rem;
  font-size: 1.1rem;
  line-height: 0;
}

.member-section {
  width: 100%;
}

.pending-section {
  margin-top: 2rem;
}

.member-section-title {
  margin: 0 0 0.9rem;
  color: #415247;
  font-size: 0.78rem;
  font-weight: 700;
}

.member-list {
  width: 100%;
}

.member-row {
  display: grid;
  grid-template-columns: 2rem minmax(10rem, 1fr) 6.5rem 10rem 6.5rem;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #8a9391;
  font-size: 0.72rem;
}

.member-avatar {
  width: 1.35rem;
  height: 1.35rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fecaca;
  color: #ef4444;
  font-size: 0.5rem;
  font-weight: 700;
}

.member-email {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-role {
  width: fit-content;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: #dcfce7;
  color: #22c55e;
  font-size: 0.62rem;
  font-weight: 600;
}

.member-role--sales {
  background: #fce7f3;
  color: #ec4899;
}

.member-role--marketing {
  background: #c7c8ff;
  color: #6366f1;
}

.member-date {
  color: #8a9391;
  white-space: nowrap;
}

.edit-role-button,
.uninvite-button {
  justify-self: end;
  border: 0;
  background: transparent;
  color: #89918f;
  font-size: 0.7rem;
  cursor: pointer;
}

.edit-role-button span {
  margin-left: 0.5rem;
  color: #b5c9dd;
  font-size: 1.3rem;
  vertical-align: -0.1rem;
}

.uninvite-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-width: 5.3rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid #ff6b6b;
  border-radius: 999px;
  color: #ef4444;
  line-height: 1;
}

.uninvite-button span {
  margin: 0;
  font-size: 1.05rem;
  line-height: 0.8;
}

.empty-members {
  margin: 0;
  padding: 1rem 0;
  color: #9ca3af;
  font-size: 0.75rem;
}

.search-mode-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f3f4;
}

.footer-back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.1rem;
  border: 1px solid #dbe3ea;
  border-radius: 0.65rem;
  background: #ffffff;
  color: #334155;
  font-size: 0.75rem;
  cursor: pointer;
}

@media (max-width: 800px) {
  .search-mode {
    padding-inline: 0;
  }

  .member-search-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .member-row {
    grid-template-columns: 2rem minmax(0, 1fr) auto;
  }

  .member-date,
  .edit-role-button,
  .uninvite-button {
    grid-column: 2 / -1;
    justify-self: start;
  }
}
</style>
