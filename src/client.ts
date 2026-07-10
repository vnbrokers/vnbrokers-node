import type { IBroker } from './brokers/base/IBroker';
import type { BrokerConfig } from './types/config';
import { BrokerError, BrokerErrorCode } from './errors/BrokerError';
import { SSIBroker } from './brokers/ssi';

/**
 * Entry point chính của thư viện.
 * User chỉ cần biết class này — không cần quan tâm implementation riêng
 * của DNSE/FHSC/SSI/TCBS bên dưới.
 *
 * @example
 * const client = new VNBrokerClient({
 *   broker: 'ssi',
 *   auth: { consumerId: '...', consumerSecret: '...' },
 * });
 * await client.login();
 * const positions = await client.getPositions(accountId);
 */
export class VNBrokerClient {
  private readonly broker: IBroker;
  private readonly config: BrokerConfig;

  constructor(config: BrokerConfig) {
    this.config = config;
    this.broker = VNBrokerClient.createBroker(config);
  }

  private static createBroker(config: BrokerConfig): IBroker {
    switch (config.broker) {
      case 'ssi':
        return new SSIBroker(config);
      case 'dnse':
      case 'tcbs':
      case 'fhsc':
        throw new BrokerError({
          code: BrokerErrorCode.UNKNOWN,
          message: `Broker "${config.broker}" chưa được implement — mới có sẵn: ssi`,
          broker: config.broker,
        });
      default:
        throw new BrokerError({
          code: BrokerErrorCode.UNKNOWN,
          message: `Broker không hợp lệ: ${String(config.broker)}`,
          broker: String(config.broker),
        });
    }
  }

  /** Expose broker gốc nếu cần dùng tính năng đặc thù không có trong IBroker */
  get raw(): IBroker {
    return this.broker;
  }

  login() {
    return this.broker.login(this.config.auth);
  }

  logout() {
    return this.broker.logout();
  }

  getAccountInfo() {
    return this.broker.getAccountInfo();
  }

  getBalance(accountId: string) {
    return this.broker.getBalance(accountId);
  }

  getPositions(accountId: string) {
    return this.broker.getPositions(accountId);
  }

  placeOrder(order: Parameters<IBroker['placeOrder']>[0]) {
    return this.broker.placeOrder(order);
  }

  cancelOrder(accountId: string, orderId: string) {
    return this.broker.cancelOrder(accountId, orderId);
  }

  getOrderHistory(accountId: string) {
    return this.broker.getOrderHistory(accountId);
  }

  getQuote(symbol: string) {
    return this.broker.getQuote(symbol);
  }

  subscribeQuote(symbol: string, callback: Parameters<IBroker['subscribeQuote']>[1]) {
    return this.broker.subscribeQuote(symbol, callback);
  }
}
