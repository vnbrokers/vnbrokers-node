export enum BrokerErrorCode {
  AUTH_FAILED = 'AUTH_FAILED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_ORDER = 'INVALID_ORDER',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  RATE_LIMITED = 'RATE_LIMITED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Lỗi chuẩn hóa: mỗi broker ném lỗi với format/mã khác nhau,
 * adapter phải map về BrokerError trước khi throw ra ngoài cho user.
 */
export class BrokerError extends Error {
  readonly code: BrokerErrorCode;
  readonly broker: string;
  readonly raw?: unknown; // giữ lại lỗi gốc để debug

  constructor(params: {
    code: BrokerErrorCode;
    message: string;
    broker: string;
    raw?: unknown;
  }) {
    super(params.message);
    this.name = 'BrokerError';
    this.code = params.code;
    this.broker = params.broker;
    this.raw = params.raw;
  }
}
