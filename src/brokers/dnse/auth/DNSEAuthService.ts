import { BrokerError, BrokerErrorCode } from '../../../errors/BrokerError';
import type {
  DNSESendEmailOTPResponse,
  DNSETradingTokenRequest,
  DNSETradingTokenResponse,
} from '../native/dnse.types';
import type { DNSEHttpClient } from '../client/DNSEHttpClient';

export class DNSEAuthService {
  constructor(private readonly http: DNSEHttpClient) {}

  sendEmailOTP(): Promise<DNSESendEmailOTPResponse> {
    return this.http.request('POST', '/registration/send-email-otp');
  }

  async getTradingToken(request: DNSETradingTokenRequest): Promise<DNSETradingTokenResponse> {
    const response = await this.http.request<DNSETradingTokenResponse>(
      'POST',
      '/registration/trading-token',
      { body: request },
    );
    if (!response.tradingToken) {
      throw new BrokerError({
        code: BrokerErrorCode.AUTH_FAILED,
        message: 'DNSE trả về trading-token rỗng',
        broker: 'dnse',
        raw: response,
      });
    }
    this.http.setTradingToken(response.tradingToken);
    return response;
  }
}
