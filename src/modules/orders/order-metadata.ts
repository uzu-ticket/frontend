export interface OrderMetadataRecipient {
  name: string;
  email: string;
  phone?: string;
}

export interface OrderMetadataItem {
  ticketTypeId: string;
  quantity: number;
  unitPriceMinor: string; // BigInt as string — see Order.metadata deviation note in schema.prisma
  recipients: OrderMetadataRecipient[];
}

export interface OrderMetadata {
  items: OrderMetadataItem[];
}
