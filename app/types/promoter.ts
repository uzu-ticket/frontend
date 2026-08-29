export interface PromoterCommission {
  totalEarned: number
  pending: number
  available: number
  paidOut: number
}

export interface PromoterEventCommission {
  id: string
  event: string
  ticketsSold: number
  commissionRate: string
  commissionEarned: number
  status: 'Completed' | 'Cancelled' | 'Pending'
}

export interface CreatePromoterLinkDto {
  eventId: string
  commissionType: 'percentage' | 'fixed'
  commissionValue: number
  expiresAt?: string
}
