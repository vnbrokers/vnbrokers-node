import type { OrderSide, OrderStatus, OrderType, MarketStatus } from './enums';

/** Normalized authentication session shared by all brokers */
export interface Session {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // epoch ms
}

/** Normalized account information */
export interface Account {
  accountId: string;
  ownerName?: string;
  brokerName: string;
}

/** Account balance */
export interface Balance {
  accountId: string;
  cashBalance: number;
  availableCash: number;
  totalAssetValue: number;
  currency: 'VND';
}

/** Open position */
export interface Position {
  accountId: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  marketPrice?: number;
  unrealizedPnl?: number;
}

/** Order request sent to a broker */
export interface OrderRequest {
  accountId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number; // Required when type = LIMIT
  clientOrderId?: string;
}

/** Order placement result */
export interface OrderResult {
  orderId: string;
  clientOrderId?: string;
  status: OrderStatus;
  submittedAt: number;
}

/** Order information returned by history queries */
export interface Order extends OrderRequest {
  orderId: string;
  status: OrderStatus;
  filledQuantity: number;
  avgFillPrice?: number;
  createdAt: number;
  updatedAt: number;
}

/** Real-time or snapshot quote */
export interface Quote {
  symbol: string;
  bidPrice: number;
  askPrice: number;
  lastPrice: number;
  volume: number;
  changePercent: number;
  marketStatus: MarketStatus;
  timestamp: number;
}

/** Candlestick data */
export interface OHLC {
  symbol: string;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Unsubscribe = () => void;
