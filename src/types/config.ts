export type BrokerName = 'dnse' | 'fhsc' | 'ssi' | 'tcbs';

/** Thông tin xác thực, mỗi broker dùng field khác nhau nên để linh hoạt */
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
  baseUrl?: string; // override endpoint mặc định nếu cần (sandbox/prod)
  timeoutMs?: number;
}
