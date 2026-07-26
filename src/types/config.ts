export type BrokerName = 'dnse' | 'fhsc' | 'ssi' | 'tcbs';

/** Flexible credentials because each broker uses different fields */
export interface AuthConfig {
  consumerId?: string;
  consumerSecret?: string;
  username?: string;
  password?: string;
  otp?: string;
  [key: string]: unknown;
}

export interface BrokerConfig {
  broker: BrokerName;
  auth: AuthConfig;
  baseUrl?: string; // Override the default endpoint when needed (sandbox/production)
  timeoutMs?: number;
}

export interface DNSEBrokerConfig extends BrokerConfig {
  broker: 'dnse';
  apiKey: string;
  apiSecret: string;
  tradingToken?: string;
}
