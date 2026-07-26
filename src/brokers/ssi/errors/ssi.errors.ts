import { BrokerError, BrokerErrorCode } from '../../../errors/BrokerError';

/** SSI business error codes returned in the response body (not HTTP status codes) */
const SSI_BUSINESS_ERROR_MAP: Record<string, BrokerErrorCode> = {
  '412': BrokerErrorCode.INVALID_ORDER,
  '413': BrokerErrorCode.INSUFFICIENT_BALANCE,
};

export function mapSSIBusinessError(status: number, message: string): BrokerError {
  const code = SSI_BUSINESS_ERROR_MAP[String(status)] ?? BrokerErrorCode.UNKNOWN;
  return new BrokerError({ code, message, broker: 'ssi', raw: { status, message } });
}
