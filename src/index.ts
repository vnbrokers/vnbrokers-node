// Public entry point — chỉ export những gì user cần dùng

export { VNBrokerClient } from './client';

export type {
  IBroker,
} from './brokers/base/IBroker';

export type {
  Account,
  Position,
  Balance,
  Order,
  OrderRequest,
  OrderResult,
  Quote,
  OHLC,
  Session,
} from './types/common';

export {
  OrderSide,
  OrderType,
  OrderStatus,
  MarketStatus,
} from './types/enums';

export type {
  BrokerConfig,
  DNSEBrokerConfig,
  AuthConfig,
  BrokerName,
} from './types/config';

export { BrokerError, BrokerErrorCode } from './errors/BrokerError';

export {
  DNSEBroker,
  DNSEHttpClient,
} from './brokers/dnse';

export type {
  DNSEHttpClientOptions,
  DNSEGetInstrumentsRequest,
  DNSEGetOrdersRequest,
  DNSEInstrument,
  DNSEInstrumentsResponse,
  DNSEOrder,
  DNSEOrdersResponse,
  DNSESendEmailOTPResponse,
  DNSETradingTokenRequest,
  DNSETradingTokenResponse,
} from './brokers/dnse';
