import type { DNSEBrokerConfig } from '../../types/config';

export const DNSE_DEFAULT_BASE_URL = 'https://openapi.dnse.com.vn';

export interface DNSEResolvedConfig {
  apiKey: string;
  apiSecret: string;
  tradingToken?: string;
  baseUrl: string;
  timeoutMs: number;
}

export function resolveDNSEConfig(config: DNSEBrokerConfig): DNSEResolvedConfig {
  if (!config.apiKey || !config.apiSecret) {
    throw new Error('DNSE requires apiKey and apiSecret');
  }

  return {
    apiKey: config.apiKey,
    apiSecret: config.apiSecret,
    tradingToken: config.tradingToken,
    baseUrl: config.baseUrl ?? DNSE_DEFAULT_BASE_URL,
    timeoutMs: config.timeoutMs ?? 10_000,
  };
}
