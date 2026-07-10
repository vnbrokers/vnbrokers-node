import type { IBroker } from '../base/IBroker';
import type { DNSEBrokerConfig, AuthConfig } from '../../types/config';
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
import { BrokerError, BrokerErrorCode } from '../../errors/BrokerError';
import { DNSEAuthService } from './auth/DNSEAuthService';
import { DNSEHttpClient, type DNSEHttpClientOptions } from './client/DNSEHttpClient';
import { resolveDNSEConfig } from './dnse.config';
import { DNSEMarketDataService } from './marketdata/DNSEMarketDataService';
import { DNSETradingService } from './trading/DNSETradingService';

/**
 * DNSE hiện chỉ expose native operations. `login()` chuẩn không dùng được cho
 * flow OTP; gọi `native.auth.sendEmailOTP()` rồi `native.auth.getTradingToken()`.
 */
export class DNSEBroker implements IBroker {
  readonly native: {
    auth: DNSEAuthService;
    marketData: DNSEMarketDataService;
    trading: DNSETradingService;
  };

  constructor(config: DNSEBrokerConfig, options?: DNSEHttpClientOptions) {
    const http = new DNSEHttpClient(resolveDNSEConfig(config), options);
    this.native = {
      auth: new DNSEAuthService(http),
      marketData: new DNSEMarketDataService(http),
      trading: new DNSETradingService(http),
    };
  }

  login(_credentials: AuthConfig): Promise<Session> {
    return Promise.reject(this.unsupported('login() không phù hợp với DNSE OTP flow'));
  }

  logout(): Promise<void> {
    return Promise.resolve();
  }

  getAccountInfo(): Promise<Account> { return Promise.reject(this.unsupported('getAccountInfo')); }
  getBalance(_accountId: string): Promise<Balance> { return Promise.reject(this.unsupported('getBalance')); }
  getPositions(_accountId: string): Promise<Position[]> { return Promise.reject(this.unsupported('getPositions')); }
  placeOrder(_order: OrderRequest): Promise<OrderResult> { return Promise.reject(this.unsupported('placeOrder')); }
  cancelOrder(_accountId: string, _orderId: string): Promise<boolean> { return Promise.reject(this.unsupported('cancelOrder')); }
  getOrderHistory(_accountId: string): Promise<Order[]> { return Promise.reject(this.unsupported('getOrderHistory')); }
  getQuote(_symbol: string): Promise<Quote> { return Promise.reject(this.unsupported('getQuote')); }
  subscribeQuote(_symbol: string, _callback: (quote: Quote) => void): Unsubscribe {
    throw this.unsupported('subscribeQuote');
  }

  private unsupported(operation: string): BrokerError {
    return new BrokerError({
      code: BrokerErrorCode.UNKNOWN,
      message: `DNSE chưa hỗ trợ normalized ${operation}; dùng native service`,
      broker: 'dnse',
    });
  }
}
