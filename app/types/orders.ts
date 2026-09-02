// ---------------------------------------------------------------------------
// Backend API response types (mirror Prisma output with relation includes)
// ---------------------------------------------------------------------------

export type ApiOrderStatus = "pending" | "paid" | "partially_refunded" | "refunded" | "cancelled" | "failed"

export type ApiTicketStatus = "valid" | "used" | "void" | "refunded"

export type ApiTransactionType = "ticket_purchase" | "settlement" | "refund"
export type ApiTransactionStatus = "initiated" | "processing" | "succeeded" | "failed" | "reversed"
export type ApiPaymentMethod = "card" | "bank_transfer" | "ussd"
export type ApiPspProvider = "paystack" | "flutterwave"

export interface ApiTicketType {
  id: string
  eventId: string
  name: string
  priceMinor: string
  currency: string
  quantityTotal: number
  quantitySold: number
  perOrderLimit: number | null
  saleStartsAt: string | null
  saleEndsAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiTicket {
  id: string
  orderId: string
  eventId: string
  ticketTypeId: string
  status: ApiTicketStatus
  recipientName: string
  recipientEmail: string
  recipientPhone: string | null
  qrCode: string
  signingKeyId: string
  signature: string
  issuedAt: string
  usedAt: string | null
  usedByScanId: string | null
  createdAt: string
  ticketType: ApiTicketType
}

export interface ApiTransaction {
  id: string
  transactionType: ApiTransactionType
  status: ApiTransactionStatus
  amountMinor: string
  currency: string
  orderId: string | null
  walletId: string | null
  organisationId: string | null
  withdrawalId: string | null
  parentTransactionId: string | null
  pspProvider: ApiPspProvider | null
  pspReference: string | null
  paymentMethod: ApiPaymentMethod | null
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiOrderEvent {
  id: string
  title: string
  startsAt: string
  venueName: string | null
}

export interface ApiOrder {
  id: string
  eventId: string
  buyerUserId: string | null
  buyerName: string
  buyerEmail: string
  buyerPhone: string | null
  status: ApiOrderStatus
  subtotalMinor: string
  platformFeeMinor: string
  totalMinor: string
  currency: string
  channel: string
  promoterLinkId: string | null
  metadata: unknown | null
  createdAt: string
  updatedAt: string
  event: ApiOrderEvent
  tickets: ApiTicket[]
  transactions: ApiTransaction[]
}

// ---------------------------------------------------------------------------
// Frontend view-model types
// ---------------------------------------------------------------------------

export type OrderStatus =
  | "Pending"
  | "Completed"
  | "Partially Refunded"
  | "Refunded"
  | "Cancelled"
  | "Failed"

export interface OrderBuyer {
  name: string
  email: string
  phone: string
}

export interface OrderEventInfo {
  title: string
  date: string
}

export interface OrderTicketSummary {
  count: number
  tier: string
}

export interface OrderPayment {
  method: string
  details: string
}

export interface TicketItem {
  id: string
  type: "REGULAR" | "VIP" | "VVIP" | "EARLY_BIRD"
  price: number
  available: number
  totalQuantity: number
  salesStart: string
  salesEnd: string
  qrCodeUrl?: string
}

export interface Order {
  id: string
  orderNumber: string
  reference: string
  buyer: OrderBuyer
  event: OrderEventInfo
  tickets: OrderTicketSummary
  totalAmount: number
  status: OrderStatus
  createdDate: string
  payment: OrderPayment
  ticketItems?: TicketItem[]
}

export interface Invoice {
  id: string
  invoiceNumber: string
  orderNumber: string
  buyer: OrderBuyer
  amount: number
  date: string
  ticketCount: number
}

export type ExportFormat = "CSV" | "Excel (XLSX)" | "PDF"

// ---------------------------------------------------------------------------
// Frontend DTO types (mirror backend CreateOrderDto)
// ---------------------------------------------------------------------------

export type EmbedChannel = "direct" | "embed" | "promoter" | "recommendation" | "search"

export interface RecipientDto {
  name: string
  email: string
  phone?: string
}

export interface CreateOrderItemDto {
  ticketTypeId: string
  quantity: number
  recipients?: RecipientDto[]
}

export interface CreateOrderDto {
  eventId: string
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  channel?: EmbedChannel
  items: CreateOrderItemDto[]
}

// ---------------------------------------------------------------------------
// Status helpers & mapping
// ---------------------------------------------------------------------------

export const API_STATUS_LABELS: Record<ApiOrderStatus, OrderStatus> = {
  pending: "Pending",
  paid: "Completed",
  partially_refunded: "Partially Refunded",
  refunded: "Refunded",
  cancelled: "Cancelled",
  failed: "Failed",
}

export const ORDER_STATUS_CSS: Record<OrderStatus, string> = {
  Pending: "pending",
  Completed: "completed",
  "Partially Refunded": "partially-refunded",
  Refunded: "refunded",
  Cancelled: "cancelled",
  Failed: "failed",
}

export function orderStatusLabel(apiStatus: ApiOrderStatus): OrderStatus {
  return API_STATUS_LABELS[apiStatus]
}

export function orderStatusCssClass(status: OrderStatus): string {
  return `status--${ORDER_STATUS_CSS[status]}`
}

export function isRefundable(status: ApiOrderStatus): boolean {
  return status === "paid" || status === "partially_refunded"
}

export function isCancellable(status: ApiOrderStatus): boolean {
  return status === "pending"
}

// ---------------------------------------------------------------------------
// Mapping: API → view model
// ---------------------------------------------------------------------------

function minorToNumber(minor: string): number {
  return Number(BigInt(minor)) / 100
}

function formatCurrency(minor: string, currency = "NGN"): string {
  const major = minorToNumber(minor)
  if (currency === "NGN") {
    return `₦${major.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return major.toLocaleString("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return "—"
  const month = date.toLocaleString("en-US", { month: "short" })
  const day = date.getDate()
  const year = date.getFullYear()
  const time = date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" })
  return `${month} ${day}, ${year} ${time}`
}

function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("en-US", {
    month: "short",
    day: "d",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatPaymentMethod(method: ApiPaymentMethod | null): string {
  if (!method) return "N/A"
  const map: Record<ApiPaymentMethod, string> = {
    card: "Card",
    bank_transfer: "Bank Transfer",
    ussd: "USSD",
  }
  return map[method]
}

function formatPaymentDetails(tx: ApiTransaction | null): string {
  if (!tx) return "No payment details"
  if (tx.paymentMethod === "card" && tx.pspReference) {
    return `Card ending in ${tx.pspReference.slice(-4)}`
  }
  if (tx.pspReference) {
    return `Ref: ${tx.pspReference.slice(0, 12)}`
  }
  return "No payment details"
}

function generateOrderNumber(id: string): string {
  const short = id.replace(/-/g, "").substring(0, 8).toUpperCase()
  return `#ORD-${short}`
}

function generateReference(id: string): string {
  const short = id.replace(/-/g, "").substring(0, 10).toUpperCase()
  return `UZ${short}`
}

function findPurchaseTransaction(transactions: ApiTransaction[]): ApiTransaction | null {
  return (
    transactions.find((t) => t.transactionType === "ticket_purchase" && t.status === "succeeded") ??
    transactions.find((t) => t.transactionType === "ticket_purchase") ??
    null
  )
}

function mapTicketItems(order: ApiOrder): TicketItem[] {
  const seen = new Set<string>()
  const items: TicketItem[] = []

  for (const ticket of order.tickets) {
    if (seen.has(ticket.ticketTypeId)) continue
    seen.add(ticket.ticketTypeId)
    const tt = ticket.ticketType
    items.push({
      id: tt.id,
      type: tt.name.toUpperCase() as TicketItem["type"],
      price: minorToNumber(tt.priceMinor),
      available: tt.quantityTotal - tt.quantitySold,
      totalQuantity: tt.quantityTotal,
      salesStart: tt.saleStartsAt ? formatEventDate(tt.saleStartsAt) : "—",
      salesEnd: tt.saleEndsAt ? formatEventDate(tt.saleEndsAt) : "—",
      qrCodeUrl: ticket.qrCode,
    })
  }

  // Also include ticket types from the order metadata that haven't been
  // issued tickets yet (e.g. pending orders where tickets haven't been created).
  const metadata = order.metadata as { items?: Array<{ ticketTypeId: string }> } | null
  if (metadata?.items) {
    for (const item of metadata.items) {
      // We don't have ticket type info from metadata alone; only push if not already seen
      // This is handled by the tickets relation above for paid orders
    }
  }

  return items
}

export function mapOrderFromApi(order: ApiOrder): Order {
  const purchaseTx = findPurchaseTransaction(order.transactions)
  const ticketTypes = order.tickets.map((t) => t.ticketType)
  const uniqueTier = ticketTypes[0]?.name ?? "General"

  return {
    id: order.id,
    orderNumber: generateOrderNumber(order.id),
    reference: generateReference(order.id),
    buyer: {
      name: order.buyerName,
      email: order.buyerEmail,
      phone: order.buyerPhone ?? "",
    },
    event: {
      title: order.event.title,
      date: formatEventDate(order.event.startsAt),
    },
    tickets: {
      count: order.tickets.length,
      tier: uniqueTier,
    },
    totalAmount: minorToNumber(order.totalMinor),
    status: orderStatusLabel(order.status),
    createdDate: formatDate(order.createdAt),
    payment: {
      method: formatPaymentMethod(purchaseTx?.paymentMethod ?? null),
      details: formatPaymentDetails(purchaseTx),
    },
    ticketItems: mapTicketItems(order),
  }
}

export function mapOrdersFromApi(orders: ApiOrder[]): Order[] {
  return orders.map(mapOrderFromApi)
}

// ---------------------------------------------------------------------------
// Metrics computation helpers
// ---------------------------------------------------------------------------

export interface OrderMetrics {
  totalOrders: number
  ticketsSold: number
  totalRevenue: number
  totalRefunds: number
}

export function computeOrderMetrics(orders: Order[]): OrderMetrics {
  let ticketsSold = 0
  let totalRevenue = 0
  let totalRefunds = 0

  for (const order of orders) {
    ticketsSold += order.tickets.count
    if (order.status === "Completed" || order.status === "Pending") {
      totalRevenue += order.totalAmount
    }
    if (order.status === "Refunded" || order.status === "Partially Refunded" || order.status === "Failed") {
      totalRefunds += order.totalAmount
    }
  }

  return {
    totalOrders: orders.length,
    ticketsSold,
    totalRevenue,
    totalRefunds,
  }
}

export function formatCurrencyFromMinor(minor: string, currency = "NGN"): string {
  return formatCurrency(minor, currency)
}
