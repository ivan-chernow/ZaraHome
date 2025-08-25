// Типы для заказов
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'returned';

export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

export type OrderPaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type OrderPaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'cash_on_delivery'
  | 'digital_wallet'
  | 'cryptocurrency';

export type OrderItemType = {
  productId: number;
  quantity: number;
  price: number;
  size: string;
  color: string;
  discount?: number;
  totalPrice: number;
};

export type OrderShipping = {
  method: 'standard' | 'express' | 'overnight';
  cost: number;
  estimatedDelivery: Date;
  trackingNumber?: string;
  carrier?: string;
};

export type OrderBilling = {
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
};

export type OrderHistory = {
  status: OrderStatus;
  timestamp: Date;
  comment?: string;
  updatedBy: string;
};

export type OrderFilters = {
  status?: OrderStatus;
  userId?: number;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  totalAmountMin?: number;
  totalAmountMax?: number;
  paymentStatus?: OrderPaymentStatus;
};

export type OrderSortOptions = 
  | 'created_at_asc'
  | 'created_at_desc'
  | 'total_amount_asc'
  | 'total_amount_desc'
  | 'status_asc'
  | 'status_desc'
  | 'updated_at_asc'
  | 'updated_at_desc';

// Типы для корзины
export type CartItemType = {
  productId: number;
  quantity: number;
  size: string;
  color: string;
  addedAt: Date;
  updatedAt: Date;
};

export type CartSummaryType = {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
};

export type CartValidationType = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  outOfStockItems: number[];
  priceChangedItems: number[];
};
