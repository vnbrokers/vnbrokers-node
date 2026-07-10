import type { AuthConfig } from '../../types/config';
import type {
  Account,
  Balance,
  Order,
  OrderRequest,
  OrderResult,
  Position,
  Quote,
  Session,
  Unsubscribe,
} from '../../types/common';

/**
 * Interface chuẩn mà mọi adapter (SSIBroker, DNSEBroker, ...) phải implement.
 * VNBrokerClient chỉ làm việc thông qua interface này, không quan tâm
 * chi tiết implementation riêng của từng công ty chứng khoán.
 */
export interface IBroker {
  login(credentials: AuthConfig): Promise<Session>;
  logout(): Promise<void>;

  getAccountInfo(): Promise<Account>;
  getBalance(accountId: string): Promise<Balance>;
  getPositions(accountId: string): Promise<Position[]>;

  placeOrder(order: OrderRequest): Promise<OrderResult>;
  cancelOrder(accountId: string, orderId: string): Promise<boolean>;
  getOrderHistory(accountId: string): Promise<Order[]>;

  getQuote(symbol: string): Promise<Quote>;
  subscribeQuote(symbol: string, callback: (quote: Quote) => void): Unsubscribe;
}
