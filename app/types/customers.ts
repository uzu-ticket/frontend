export type CustomerStatus = 'Active' | 'Inactive' | 'Invalid'

export interface Customer {
  id: string
  customerId: string // e.g. "CUST 0032026"
  initials: string
  avatarColor: string
  name: string
  email: string
  phone: string
  orders: number
  status: CustomerStatus
  location?: string
  dateOfBirth?: string
  preferredCurrency?: string
  marketingContent?: 'Subscribed' | 'Unsubscribed'
  lastActive?: string
  customerSince?: string
}

export interface CustomerPurchase {
  id: string
  event: string
  orderId: string
  date: string
  tickets: number
  amount: number
  status: 'Completed' | 'Cancelled' | 'Refunded' | 'Pending'
}

export interface CustomerTicket {
  id: string
  ticketNumber: string
  ticketType: string
  status: 'Sent' | 'Pending' | 'Used'
  orderId: string
  ticketInfo: {
    type: string
    purchasedAt: string
    status: string
    scannedAt: string
    gate: string
    scanner: string
  }
  event: {
    name: string
    date: string
    time: string
    venue: string
  }
  ticketId: string
  recipient: {
    name: string
    email: string
    phone: string
  }
}

export interface CustomerActivity {
  id: string
  date: string
  description: string
}
