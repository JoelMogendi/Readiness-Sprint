export type DeliveryStatus = 'IN_TRANSIT' | 'SCHEDULED' | 'DELAYED' | 'DELIVERED';

export interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  itemDescription: string;
  status: DeliveryStatus;
  retailerId: string;
  dispatcherId?: string;
  riderId?: string;
  rider?: {
    id: string;
    name: string;
  };
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  itemDescription: string;
}