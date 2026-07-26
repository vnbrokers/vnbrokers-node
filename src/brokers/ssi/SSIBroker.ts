import type { IBroker } from '../base/IBroker';
import type { BrokerConfig, AuthConfig } from '../../types/config';
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

import { resolveSSIConfig } from './ssi.config';
import { SSIHttpClient } from './client/SSIHttpClient';
import { SSIAuthService } from './auth/SSIAuthService';
import { SSIAccountService } from './account/SSIAccountService';
import { SSIOrderService } from './order/SSIOrderService';
import { SSIMarketService } from './market/SSIMarketService';

const SSI_WS_URL = 'wss://fc-datafeed.ssi.com.vn/quote';

/**
 * Facade that only initializes and delegates to domain-specific services.
 * Business logic belongs in the auth/account/order/market services, not here.
 */
export class SSIBroker implements IBroker {
  private readonly http: SSIHttpClient;
  private readonly authService: SSIAuthService;
  private readonly accountService: SSIAccountService;
  private readonly orderService: SSIOrderService;
  private readonly marketService: SSIMarketService;

  constructor(config: BrokerConfig) {
    const resolved = resolveSSIConfig(config);
    this.http = new SSIHttpClient(resolved);
    this.authService = new SSIAuthService(this.http);
    this.accountService = new SSIAccountService(this.http);
    this.orderService = new SSIOrderService(this.http);
    this.marketService = new SSIMarketService(this.http, SSI_WS_URL);
  }

  login(credentials: AuthConfig): Promise<Session> {
    return this.authService.login(credentials);
  }

  logout(): Promise<void> {
    return this.authService.logout();
  }

  getAccountInfo(): Promise<Account> {
    return this.accountService.getAccountInfo();
  }

  getBalance(accountId: string): Promise<Balance> {
    return this.accountService.getBalance(accountId);
  }

  getPositions(accountId: string): Promise<Position[]> {
    return this.accountService.getPositions(accountId);
  }

  placeOrder(order: OrderRequest): Promise<OrderResult> {
    return this.orderService.place(order);
  }

  cancelOrder(accountId: string, orderId: string): Promise<boolean> {
    return this.orderService.cancel(accountId, orderId);
  }

  getOrderHistory(accountId: string): Promise<Order[]> {
    return this.orderService.getHistory(accountId);
  }

  getQuote(symbol: string): Promise<Quote> {
    return this.marketService.getQuote(symbol);
  }

  subscribeQuote(symbol: string, callback: (quote: Quote) => void): Unsubscribe {
    return this.marketService.subscribeQuote(symbol, callback);
  }
}
