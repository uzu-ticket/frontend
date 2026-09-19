import { ref, computed } from 'vue'

export interface EventPerformanceItem {
  id: string
  name: string
  date: string
  ticketsSold: number
  orders: number
  grossRevenue: string
}

export interface TicketTypePerformance {
  type: string
  price: string
  ticketsSold: number
  orders: number
  grossRevenue: string
  pctOfTotal: string
}

export interface DuplicateAttemptAlert {
  scanId: string
  time: string
  gate: string
  ticketId: string
  buyer: string
  email: string
  phone: string
  status: 'Needs Review' | 'Resolved'
  ticketType: string
  scanTime: string
  scanHistory: {
    time: string
    gate: string
    device: string
    isDuplicate: boolean
  }[]
}

const mockEvents: EventPerformanceItem[] = [
  {
    id: 'summer-fest-2026',
    name: 'Summer Fest 2026',
    date: 'July 20, 2026',
    ticketsSold: 2812,
    orders: 1125,
    grossRevenue: '₦5,756,200',
  },
  {
    id: 'zeenom-live-concert',
    name: 'Zeenom Live Concert',
    date: 'Aug 30, 2026',
    ticketsSold: 2008,
    orders: 786,
    grossRevenue: '₦4,380,000',
  },
  {
    id: 'kareoke-live-concert',
    name: 'Kareoke Live Concert',
    date: 'Sep 18, 2026',
    ticketsSold: 1992,
    orders: 437,
    grossRevenue: '₦3,211,500',
  },
]

const mockTicketTypes: TicketTypePerformance[] = [
  {
    type: 'VIP',
    price: '₦25,000',
    ticketsSold: 2812,
    orders: 1128,
    grossRevenue: '₦5,640,000',
    pctOfTotal: '40.1%',
  },
  {
    type: 'Early Bird',
    price: '₦10,000',
    ticketsSold: 2008,
    orders: 1249,
    grossRevenue: '₦2,498,000',
    pctOfTotal: '44.7%',
  },
  {
    type: 'Regular',
    price: '₦15,000',
    ticketsSold: 1992,
    orders: 612,
    grossRevenue: '₦468,000',
    pctOfTotal: '11.1%',
  },
]

const mockDuplicateAlerts = ref<DuplicateAttemptAlert[]>([
  {
    scanId: 'scan-1',
    time: '10:31 AM',
    gate: 'Gate A',
    ticketId: 'UTK-873K-0YKD',
    buyer: 'A. Johnson',
    email: 'ajjohnson@gmail.cm',
    phone: '+234 809 6552391',
    status: 'Needs Review',
    ticketType: 'VIP',
    scanTime: '10:41 PM, Sept 20, 2026',
    scanHistory: [
      { time: '10:12 AM', gate: 'Gate B', device: 'Devices #12', isDuplicate: false },
      { time: '10:12 AM', gate: 'Gate B', device: '', isDuplicate: true },
    ],
  },
  {
    scanId: 'scan-2',
    time: '11:30 AM',
    gate: 'Gate C',
    ticketId: 'UTX-275-OPKA',
    buyer: 'T. Okafor',
    email: 'tokafor@gmail.com',
    phone: '+234 802 1234567',
    status: 'Needs Review',
    ticketType: 'Regular',
    scanTime: '11:30 AM, Sept 20, 2026',
    scanHistory: [
      { time: '11:15 AM', gate: 'Gate A', device: 'Devices #04', isDuplicate: false },
      { time: '11:30 AM', gate: 'Gate C', device: '', isDuplicate: true },
    ],
  },
  {
    scanId: 'scan-3',
    time: '12:00 PM',
    gate: 'Gate A',
    ticketId: 'UTX-374-OYKB',
    buyer: 'D. Williams',
    email: 'dwilliams@gmail.com',
    phone: '+234 811 9876543',
    status: 'Resolved',
    ticketType: 'Early Bird',
    scanTime: '12:00 PM, Sept 20, 2026',
    scanHistory: [
      { time: '11:45 AM', gate: 'Gate D', device: 'Devices #09', isDuplicate: false },
      { time: '12:00 PM', gate: 'Gate A', device: '', isDuplicate: true },
    ],
  },
])

export function useReports() {
  const isExportModalOpen = ref(false)

  function openExportModal() {
    isExportModalOpen.value = true
  }

  function closeExportModal() {
    isExportModalOpen.value = false
  }

  function markAlertResolved(scanId: string) {
    const alert = mockDuplicateAlerts.value.find((a) => a.scanId === scanId)
    if (alert) {
      alert.status = 'Resolved'
    }
  }

  return {
    eventsList: mockEvents,
    ticketTypesList: mockTicketTypes,
    duplicateAlerts: mockDuplicateAlerts,
    isExportModalOpen,
    openExportModal,
    closeExportModal,
    markAlertResolved,
  }
}
