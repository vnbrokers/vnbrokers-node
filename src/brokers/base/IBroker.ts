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
 * Standard interface implemented by every adapter (SSIBroker, DNSEBroker, etc.).
 * VNBrokerClient only interacts through this interface and does not depend on
 * implementation details specific to each brokerage.
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
