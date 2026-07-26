import type { BrokerConfig } from '../../types/config';

export const SSI_DEFAULT_BASE_URL = 'https://fc-tradeapi.ssi.com.vn';

export interface SSIResolvedConfig {
  baseUrl: string;
  timeoutMs: number;
  auth: BrokerConfig['auth'];
}

export function resolveSSIConfig(config: BrokerConfig): SSIResolvedConfig {
  return {
    baseUrl: config.baseUrl ?? SSI_DEFAULT_BASE_URL,
    timeoutMs: config.timeoutMs ?? 10_000,
    auth: config.auth,
  };
}
