import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useOrgState } from '~/composables/useOrgState'

export interface FinanceTransaction {
  id: string
  date: string
  timestamp?: string
  description: string
  type: 'Credit' | 'Debit'
  amount: number
  amountFormatted: string
  status: 'Completed' | 'Pending' | 'Failed'
  event?: string
  transactionId?: string
  referenceId?: string
  fee?: string
  netAmount?: string
}

export interface WithdrawalDetails {
  id: string
  amount: number
  fee: number
  netAmount: number
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  referenceId: string
  status: 'Initiated' | 'Bank Verification' | 'Processing' | 'Completed' | 'Failed'
  requestedAt: string
  verifiedAt?: string
  completedAt?: string
  timeline: Array<{
    title: string
    timestamp: string
    status: 'completed' | 'in_progress' | 'pending'
  }>
}

const mockTransactions: FinanceTransaction[] = [
  {
    id: 'tx-1',
    date: '18 Sept 2026',
    timestamp: '14 Sept 2026. 10: 24 AM',
    description: 'Event ticket sales',
    type: 'Credit',
    amount: 320000,
    amountFormatted: '₦330,000.00',
    status: 'Completed',
    event: 'Summer Vibes 2026',
    transactionId: 'TXN-2023455687-8769',
    referenceId: 'EB-20260914-006',
    fee: '₦16,000.00 (5%)',
    netAmount: '₦304,500',
  },
  {
    id: 'tx-2',
    date: '12 Sept 2026',
    timestamp: '12 Sept 2026. 04: 15 PM',
    description: 'Withdrawal',
    type: 'Debit',
    amount: 150000,
    amountFormatted: '₦150,000.00',
    status: 'Completed',
    referenceId: 'WDT-202260985212-004',
    fee: '₦500.00',
    netAmount: '₦149,500',
  },
  {
    id: 'tx-3',
    date: '22 Sept 2026',
    timestamp: '22 Sept 2026. 11: 30 AM',
    description: 'Event ticket sales',
    type: 'Credit',
    amount: 330000,
    amountFormatted: '₦330,000.00',
    status: 'Completed',
    event: 'Afrobeats Fest 2026',
    transactionId: 'TXN-2023455687-8890',
    referenceId: 'EB-20260922-010',
    fee: '₦16,500.00 (5%)',
    netAmount: '₦313,500',
  },
  {
    id: 'tx-4',
    date: '22 Sept 2026',
    timestamp: '22 Sept 2026. 02: 00 PM',
    description: 'Withdrawal',
    type: 'Debit',
    amount: 330000,
    amountFormatted: '₦330,000.00',
    status: 'Completed',
    referenceId: 'WDT-202260985214-006',
    fee: '₦500.00',
    netAmount: '₦329,500',
  },
  {
    id: 'tx-5',
    date: '10 Sept 2026',
    timestamp: '10 Sept 2026. 09: 10 AM',
    description: 'Event ticket sales',
    type: 'Credit',
    amount: 48000,
    amountFormatted: '₦48,000.00',
    status: 'Completed',
    event: 'Night Life VIP',
    transactionId: 'TXN-2023455687-8102',
    referenceId: 'EB-20260910-002',
    fee: '₦2,400.00 (5%)',
    netAmount: '₦45,600',
  },
  {
    id: 'tx-6',
    date: '22 Sept 2026',
    timestamp: '22 Sept 2026. 05: 45 PM',
    description: 'Withdrawal',
    type: 'Debit',
    amount: 48000,
    amountFormatted: '₦48,000.00',
    status: 'Completed',
    referenceId: 'WDT-202260985214-007',
    fee: '₦500.00',
    netAmount: '₦47,500',
  },
  {
    id: 'tx-7',
    date: '10 Sept 2026',
    timestamp: '10 Sept 2026. 03: 20 PM',
    description: 'Ticket refund',
    type: 'Debit',
    amount: 100000,
    amountFormatted: '₦100,000.00',
    status: 'Completed',
    event: 'Summer Vibes 2026',
    transactionId: 'TXN-2023455687-8099',
    referenceId: 'REF-20260910-001',
  },
]

export function useFinance() {
  const { instance } = useApi()
  const { activeOrgId } = useOrgState()

  const walletBalance = ref(500320)
  const totalEarned = ref(2843000)
  const pendingSettlement = ref(340000)
  const totalCredit = ref(2340000)
  const totalDebit = ref(1120000)

  const isBalanceHidden = ref(false)
  const isLoading = ref(false)
  const transactions = ref<FinanceTransaction[]>(mockTransactions)
  const selectedTransaction = ref<FinanceTransaction | null>(mockTransactions[0])

  const activeWithdrawal = ref<WithdrawalDetails>({
    id: 'WDT-202260985214-008',
    amount: 500000,
    fee: 500,
    netAmount: 499500,
    bankName: 'Zenith Bank ****1098',
    bankCode: '057',
    accountNumber: '0145661098',
    accountName: 'Divine Emmanuel NyenneAbasi',
    referenceId: 'WDT-202260985214-008',
    status: 'Processing',
    requestedAt: '14 Sept 2026, 02:14 PM',
    verifiedAt: '14 Sept 2026, 02:14 PM',
    timeline: [
      { title: 'Requested received', timestamp: '14 Sept 2026, 02:14 PM', status: 'completed' },
      { title: 'Bank verification', timestamp: '14 Sept 2026, 02:14 PM', status: 'completed' },
      { title: 'Processing', timestamp: 'In progress', status: 'in_progress' },
      { title: 'Completed', timestamp: 'Pending', status: 'pending' },
    ],
  })

  const formattedBalance = computed(() => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(walletBalance.value)
  })

  const formattedTotalEarned = computed(() => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalEarned.value)
  })

  const formattedPendingSettlement = computed(() => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(pendingSettlement.value)
  })

  function toggleBalanceVisibility() {
    isBalanceHidden.value = !isBalanceHidden.value
  }

  function selectTx(tx: FinanceTransaction) {
    selectedTransaction.value = tx
  }

  async function fetchWallet() {
    if (!activeOrgId.value) return
    isLoading.value = true
    try {
      const res = await instance.get(`/organisations/${activeOrgId.value}/wallet`)
      if (res.data) {
        const rawBal = res.data.balanceMinor
          ? Number(res.data.balanceMinor) / 100
          : walletBalance.value
        walletBalance.value = rawBal || 500320
      }
    } catch {
      // Fallback to mock balance
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTransactions() {
    if (!activeOrgId.value) return
    try {
      const res = await instance.get(`/organisations/${activeOrgId.value}/wallet/transactions`)
      if (Array.isArray(res.data) && res.data.length > 0) {
        transactions.value = res.data.map((tx: any) => ({
          id: tx.id,
          date: new Date(tx.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          timestamp: new Date(tx.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          description: tx.description || (tx.transactionType === 'ticket_purchase' ? 'Event ticket sales' : 'Withdrawal'),
          type: tx.transactionType === 'ticket_purchase' ? 'Credit' : 'Debit',
          amount: Number(tx.amountMinor) / 100,
          amountFormatted: `₦${(Number(tx.amountMinor) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
          status: tx.status === 'succeeded' ? 'Completed' : 'Pending',
          event: tx.order?.event?.title || 'Summer Vibes 2026',
          transactionId: tx.id,
          referenceId: tx.id,
        }))
      }
    } catch {
      // Fallback mock transactions
    }
  }

  async function exportStatement() {
    if (!activeOrgId.value) {
      downloadCsvMock()
      return
    }
    try {
      const res = await instance.get(`/organisations/${activeOrgId.value}/withdrawals/statement.csv`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `statement-${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch {
      downloadCsvMock()
    }
  }

  function downloadCsvMock() {
    const headers = 'DATE,DESCRIPTION,TYPE,AMOUNT,STATUS\n'
    const rows = mockTransactions.map((t) => `"${t.date}","${t.description}","${t.type}","${t.amountFormatted}","${t.status}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `statement-uzu-ticket.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  function createWithdrawal(data: {
    amount: number
    bankName: string
    accountNumber: string
    accountName: string
  }) {
    const fee = 500
    const netAmount = data.amount - fee
    const refId = `WDT-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`

    activeWithdrawal.value = {
      id: refId,
      amount: data.amount,
      fee,
      netAmount,
      bankName: `${data.bankName} ****${data.accountNumber.slice(-4)}`,
      bankCode: '057',
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      referenceId: refId,
      status: 'Processing',
      requestedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      verifiedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timeline: [
        { title: 'Requested received', timestamp: 'Just now', status: 'completed' },
        { title: 'Bank verification', timestamp: 'Just now', status: 'completed' },
        { title: 'Processing', timestamp: 'In progress', status: 'in_progress' },
        { title: 'Completed', timestamp: 'Pending', status: 'pending' },
      ],
    }

    // Deduct from wallet balance
    walletBalance.value = Math.max(0, walletBalance.value - data.amount)
    // Add to transaction log
    transactions.value.unshift({
      id: refId,
      date: 'Today',
      description: 'Withdrawal',
      type: 'Debit',
      amount: data.amount,
      amountFormatted: `₦${data.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      status: 'Completed',
      referenceId: refId,
    })
  }

  return {
    walletBalance,
    formattedBalance,
    totalEarned,
    formattedTotalEarned,
    pendingSettlement,
    formattedPendingSettlement,
    totalCredit,
    totalDebit,
    isBalanceHidden,
    toggleBalanceVisibility,
    isLoading,
    transactions,
    selectedTransaction,
    selectTx,
    activeWithdrawal,
    fetchWallet,
    fetchTransactions,
    exportStatement,
    createWithdrawal,
  }
}
