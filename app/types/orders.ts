export type OrderStatus = 'Published' | 'Draft' | 'Refunded' | 'Completed' | 'Cancelled'

export interface TicketItem {
  id: string
  type: 'REGULAR' | 'VIP' | 'VVIP' | 'EARLY_BIRD'
  price: number
  available: number
  totalQuantity: number
  salesStart: string
  salesEnd: string
  qrCodeUrl?: string
}

export interface Order {
  id: string
  orderNumber: string // e.g. "#ORD-1264"
  reference: string // e.g. "UZ12481248"
  buyer: {
    name: string
    email: string
    phone: string
  }
  event: {
    title: string
    date: string
  }
  tickets: {
    count: number
    tier: string
  }
  totalAmount: number
  status: OrderStatus
  createdDate: string
  payment: {
    method: string
    details: string
  }
  ticketItems?: TicketItem[]
}

export interface Invoice {
  id: string
  invoiceNumber: string // e.g. "#INV-1248B"
  orderNumber: string // e.g. "#ORD-1248"
  buyer: {
    name: string
    email: string
    phone: string
  }
  amount: number
  date: string
  ticketCount: number
}

export type ExportFormat = 'CSV' | 'Excel (XLSX)' | 'PDF'
