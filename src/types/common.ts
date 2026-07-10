import type { OrderSide, OrderStatus, OrderType, MarketStatus } from './enums';

/** Phiên đăng nhập đã chuẩn hóa, dùng chung cho mọi broker */
export interface Session {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // epoch ms
}

/** Thông tin tài khoản đã chuẩn hóa */
export interface Account {
  accountId: string;
  ownerName?: string;
  brokerName: string;
}

/** Số dư tài khoản */
export interface Balance {
  accountId: string;
  cashBalance: number;
  availableCash: number;
  totalAssetValue: number;
  currency: 'VND';
}

/** Vị thế đang nắm giữ */
export interface Position {
  accountId: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  marketPrice?: number;
  unrealizedPnl?: number;
}

/** Yêu cầu đặt lệnh gửi lên broker */
export interface OrderRequest {
  accountId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number; // bắt buộc nếu type = LIMIT
  clientOrderId?: string;
}

/** Kết quả sau khi đặt lệnh */
export interface OrderResult {
  orderId: string;
  clientOrderId?: string;
  status: OrderStatus;
  submittedAt: number;
}

/** Thông tin lệnh (khi tra cứu lịch sử) */
export interface Order extends OrderRequest {
  orderId: string;
  status: OrderStatus;
  filledQuantity: number;
  avgFillPrice?: number;
  createdAt: number;
  updatedAt: number;
}

/** Báo giá realtime/snapshot */
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

/** Dữ liệu nến (candlestick) */
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
