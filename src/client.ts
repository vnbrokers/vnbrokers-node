import type { IBroker } from './brokers/base/IBroker';
import type { BrokerConfig } from './types/config';
import { BrokerError, BrokerErrorCode } from './errors/BrokerError';
import { SSIBroker } from './brokers/ssi';
import { DNSEBroker } from './brokers/dnse';

/**
 * Main entry point for the library.
 * Users only need this class and do not need to know about the underlying
 * DNSE/FHSC/SSI/TCBS implementations.
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
      case 'dnse':
        return new DNSEBroker(config as import('./types/config').DNSEBrokerConfig);
      case 'ssi':
        return new SSIBroker(config);
      case 'tcbs':
      case 'fhsc':
        throw new BrokerError({
          code: BrokerErrorCode.UNKNOWN,
          message: `Broker "${config.broker}" is not implemented; available brokers: dnse, ssi`,
          broker: config.broker,
        });
      default:
        throw new BrokerError({
          code: BrokerErrorCode.UNKNOWN,
          message: `Invalid broker: ${String(config.broker)}`,
          broker: String(config.broker),
        });
    }
  }

  /** Expose the underlying broker for broker-specific features not available in IBroker */
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
