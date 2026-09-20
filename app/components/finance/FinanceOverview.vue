<template>
  <div class="finance-overview">
    <!-- Dark Green Wallet Balance Banner -->
    <div class="wallet-banner-card">
      <div class="banner-content">
        <span class="banner-label">Wallet balance</span>

        <!-- Amount Display with Eye Toggle -->
        <div class="balance-display-row">
          <span class="currency-symbol">₦</span>
          <span v-if="!isBalanceHidden" class="balance-integer">{{
            formattedBalance
          }}</span>
          <span v-else class="balance-hidden">••••••••</span>

          <button
            class="eye-toggle-btn"
            :title="isBalanceHidden ? 'Show balance' : 'Hide balance'"
            @click="toggleBalanceVisibility"
          >
            <!-- Slashed Eye SVG when hidden, Normal Eye when visible -->
            <svg
              v-if="!isBalanceHidden"
              xmlns="http://www.w3.org/2000/svg"
              class="eye-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="eye-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.858A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.092-4.092a3 3 0 11-4.243-4.243"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 3l18 18"
              />
            </svg>
          </button>
        </div>

        <span class="balance-subtitle">Available balance</span>

        <!-- Stats Row: Total Earned & Pending Settlement -->
        <div class="banner-stats-row">
          <div class="stat-item">
            <span class="stat-item-label">Total Earned</span>
            <span class="stat-item-val"
              >+{{ formattedTotalEarned ?? "0.00" }}</span
            >
          </div>
          <div class="stat-item">
            <span class="stat-item-label">Pending Settlement</span>
            <span class="stat-item-val"
              >+{{ formattedPendingSettlement ?? "0.00" }}</span
            >
          </div>
        </div>

        <!-- Action Buttons inside Banner -->
        <div class="banner-actions">
          <button
            id="btn-withdraw-now"
            class="btn-withdraw"
            @click="$emit('withdraw')"
          >
            Withdraw
          </button>
          <button
            id="btn-export-statement"
            class="btn-export"
            @click="$emit('export')"
          >
            Export statement
          </button>
        </div>
      </div>

      <!-- Wallet Graphic Illustration on Right -->
      <FinanceWalletCardGraphic />
    </div>

    <!-- Transactions Table Card -->
    <div class="transactions-card">
      <div class="card-header">
        <h2 class="card-title">Recent Transactions</h2>
        <button class="view-all-link" @click="showAllModal = true">
          View All
        </button>
      </div>

      <!-- Table -->
      <div class="table-responsive">
        <table class="tx-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>DESCRIPTION</th>
              <th>TYPE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tx in displayedTransactions"
              :key="tx.id"
              class="clickable-row"
              title="Click to view details"
              @click="$emit('select-transaction', tx)"
            >
              <td class="tx-date">{{ tx.date }}</td>
              <td class="tx-desc">{{ tx.description }}</td>
              <td class="tx-type">{{ tx.type }}</td>
              <td
                class="tx-amount"
                :class="{
                  'amount-credit': tx.type === 'Credit',
                  'amount-debit': tx.type === 'Debit',
                }"
              >
                <span v-if="tx.type === 'Credit'">{{
                  tx.amountFormatted
                }}</span>
                <span v-else>-{{ tx.amountFormatted }}</span>
              </td>
              <td class="tx-status">
                <span
                  class="status-badge"
                  :class="`status-badge--${tx.status.toLowerCase()}`"
                >
                  {{ tx.status }}
                </span>
              </td>
            </tr>
            <tr v-if="displayedTransactions.length === 0">
              <td colspan="5" class="empty-transactions-cell">
                <div class="empty-transactions-state">
                  <svg
                    class="empty-transactions-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 14.25l2.25 2.25L15 12.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="empty-transactions-title"
                    >No transactions yet</span
                  >
                  <span class="empty-transactions-copy">
                    Completed ticket sales and withdrawals will appear here.
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View All Transactions Modal -->
    <div
      v-if="showAllModal"
      class="modal-overlay"
      @click.self="showAllModal = false"
    >
      <div class="modal-card">
        <div class="modal-header">
          <h3>All Transactions</h3>
          <button class="close-btn" @click="showAllModal = false">✕</button>
        </div>
        <div class="modal-body">
          <table class="tx-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tx in transactions"
                :key="tx.id"
                class="clickable-row"
                @click="
                  showAllModal = false;
                  $emit('select-transaction', tx);
                "
              >
                <td class="tx-date">{{ tx.date }}</td>
                <td class="tx-desc">{{ tx.description }}</td>
                <td class="tx-type">{{ tx.type }}</td>
                <td
                  class="tx-amount"
                  :class="{
                    'amount-credit': tx.type === 'Credit',
                    'amount-debit': tx.type === 'Debit',
                  }"
                >
                  <span
                    >{{ tx.type === "Debit" ? "-" : ""
                    }}{{ tx.amountFormatted }}</span
                  >
                </td>
                <td class="tx-status">
                  <span
                    class="status-badge"
                    :class="`status-badge--${tx.status.toLowerCase()}`"
                    >{{ tx.status }}</span
                  >
                </td>
              </tr>
              <tr v-if="transactions.length === 0">
                <td colspan="5" class="empty-transactions-cell">
                  <div class="empty-transactions-state">
                    <span class="empty-transactions-title"
                      >No transactions yet</span
                    >
                    <span class="empty-transactions-copy">
                      Completed ticket sales and withdrawals will appear here.
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FinanceWalletCardGraphic from "./FinanceWalletCardGraphic.vue";
import type { FinanceTransaction } from "~/composables/useFinance";

const props = defineProps<{
  formattedBalance: string;
  formattedTotalEarned?: string;
  formattedPendingSettlement?: string;
  isBalanceHidden: boolean;
  transactions: FinanceTransaction[];
}>();

const emit = defineEmits<{
  withdraw: [];
  export: [];
  "toggle-balance": [];
  "select-transaction": [tx: FinanceTransaction];
}>();

const showAllModal = ref(false);

const displayedTransactions = computed(() => props.transactions.slice(0, 7));

function toggleBalanceVisibility() {
  emit("toggle-balance");
}
</script>

<style scoped>
.finance-overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Banner Card */
.wallet-banner-card {
  position: relative;
  background: linear-gradient(135deg, #071d0e 0%, #0b2813 100%);
  border-radius: 1.25rem;
  padding: 2.25rem 2rem;
  color: #ffffff;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(7, 29, 14, 0.15);
}

.banner-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  max-width: 65%;
}

.banner-label {
  font-size: 0.95rem;
  color: #a3c7aa;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.balance-display-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}

.currency-symbol {
  font-size: 2rem;
  font-weight: 800;
  color: #3fd246;
}

.balance-integer {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #ffffff;
}

.balance-hidden {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
}

.eye-toggle-btn {
  background: none;
  border: none;
  color: #3fd246;
  cursor: pointer;
  padding: 0.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  transition: opacity 0.15s;
}
.eye-toggle-btn:hover {
  opacity: 0.8;
}

.eye-icon {
  width: 1.4rem;
  height: 1.4rem;
}

.balance-subtitle {
  font-size: 0.85rem;
  color: #8da893;
  margin-bottom: 1.5rem;
}

/* Stats Row: Total Earned & Pending Settlement */
.banner-stats-row {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 1.75rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-item-label {
  font-size: 0.85rem;
  color: #a3c7aa;
  font-weight: 600;
}

.stat-item-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: #3fd246;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-withdraw {
  background: #3fd246;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.75rem 2.25rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.3);
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}
.btn-withdraw:hover {
  background: #36bd3d;
  transform: translateY(-1px);
}

.btn-export {
  background: transparent;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 1.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}
.btn-export:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Recent Transactions Card */
.transactions-card {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 1.5rem 1.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0e2615;
  margin: 0;
}

.view-all-link {
  background: none;
  border: none;
  color: #3fd246;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}
.view-all-link:hover {
  text-decoration: underline;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.tx-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.tx-table th {
  font-size: 0.75rem;
  font-weight: 700;
  color: #4b5563;
  letter-spacing: 0.05em;
  padding: 0.85rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.tx-table td {
  padding: 1.1rem 0.75rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.empty-transactions-cell {
  padding: 3rem 1rem !important;
  text-align: center;
}

.empty-transactions-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.35rem;
  color: #6b7280;
}

.empty-transactions-icon {
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 0.35rem;
  color: #9ca3af;
}

.empty-transactions-title {
  color: #374151;
  font-size: 0.95rem;
  font-weight: 700;
}

.empty-transactions-copy {
  font-size: 0.85rem;
}

.clickable-row {
  cursor: pointer;
  transition: background 0.15s ease;
}
.clickable-row:hover {
  background: #f9fafb;
}

.tx-date {
  color: #111827;
  font-weight: 600;
  white-space: nowrap;
}

.tx-desc {
  color: #111827;
  font-weight: 600;
}

.tx-type {
  color: #4b5563;
  font-weight: 500;
}

.tx-amount {
  font-weight: 700;
  white-space: nowrap;
}

.amount-credit {
  color: #3fd246;
}

.amount-debit {
  color: #ef4444;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.status-badge--completed {
  background: #dcfce7;
  color: #16a34a;
}

/* Modal styling */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: #ffffff;
  border-radius: 1rem;
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0e2615;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6b7280;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}
</style>
