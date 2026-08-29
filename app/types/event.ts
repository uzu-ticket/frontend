export type EventStatus = 'draft' | 'pending_kyb' | 'published' | 'sales_closed' | 'live' | 'completed' | 'cancelled'

export type EventVisibility = 'public' | 'unlisted'

export type ScannerMeshMode = 'android_mesh' | 'iphone_mesh' | 'shared_wifi'

export interface EventCategory {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface EventImage {
  id: string
  eventId: string
  url: string
  position: number
  isCover: boolean
  createdAt: string
}

export interface TicketType {
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

export interface EventSigningKey {
  id: string
  eventId: string
  publicKey: string
  isActive: boolean
  createdAt: string
  activatedAt: string | null
  revokedAt: string | null
}

export interface Event {
  id: string
  organisationId: string
  categoryId: string | null
  title: string
  description: string | null
  status: EventStatus
  visibility: EventVisibility
  isPaid: boolean
  scannerMeshMode: ScannerMeshMode
  venueName: string | null
  venueAddress: string | null
  latitude: string | null
  longitude: string | null
  city: string | null
  startsAt: string
  endsAt: string | null
  salesCloseAt: string
  manifestVersion: number
  manifestSealedAt: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
  category: EventCategory | null
  ticketTypes: TicketType[]
  images: EventImage[]
  signingKeys: EventSigningKey[]
}

export interface CreateTicketTypeDto {
  name: string
  priceMinor: number
  quantityTotal: number
  perOrderLimit?: number
  saleStartsAt?: string
  saleEndsAt?: string
}

export interface CreateEventDto {
  title: string
  description?: string
  categoryId?: string
  visibility?: EventVisibility
  scannerMeshMode?: ScannerMeshMode
  venueName?: string
  venueAddress?: string
  latitude?: number
  longitude?: number
  city?: string
  startsAt: string
  endsAt?: string
  salesCloseAt: string
}

