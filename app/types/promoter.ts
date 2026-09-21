export interface PromoterCommission {
  totalEarned: number
  pending: number
  available: number
  paidOut: number
}

export interface PromoterEventCommission {
  id: string
  promoterName?: string
  initials?: string
  avatarBg?: string
  event: string
  ticketsSold: number
  revenue?: number
  commissionRate?: string
  commissionEarned: number
  status: 'Active' | 'Inactive' | 'Completed' | 'Cancelled' | 'Pending'
}

export interface CreatePromoterLinkDto {
  eventId: string
  commissionType: 'percentage' | 'fixed'
  commissionValue: number
  expiresAt?: string
}
