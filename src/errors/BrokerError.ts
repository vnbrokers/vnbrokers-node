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
 * Normalized error: each broker throws errors in a different format/code,
 * so adapters must map them to BrokerError before exposing them to users.
 */
export class BrokerError extends Error {
  readonly code: BrokerErrorCode;
  readonly broker: string;
  readonly raw?: unknown; // Preserve the original error for debugging

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
