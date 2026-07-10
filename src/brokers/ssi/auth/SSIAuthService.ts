import { BaseAuthService } from '../../base/BaseAuthService';
import type { AuthConfig } from '../../../types/config';
import type { Session } from '../../../types/common';
import { BrokerError, BrokerErrorCode } from '../../../errors/BrokerError';
import type { SSIAccessTokenResponse } from './auth.types';
import { mapSSIAuthResponse } from './auth.mapper';
import type { SSIHttpClient } from '../client/SSIHttpClient';

export class SSIAuthService extends BaseAuthService {
  constructor(http: SSIHttpClient) {
    super(http);
  }

  async login(credentials: AuthConfig): Promise<Session> {
    const { consumerId, consumerSecret } = credentials;
    if (!consumerId || !consumerSecret) {
      throw new BrokerError({
        code: BrokerErrorCode.AUTH_FAILED,
        message: 'SSI yêu cầu consumerId và consumerSecret',
        broker: 'ssi',
      });
    }

    const raw = await this.http.post<SSIAccessTokenResponse>('/api/v2/Trading/AccessToken', {
      consumerID: consumerId,
      consumerSecret,
    });

    const session = mapSSIAuthResponse(raw);
    this.http.setAuthToken(session.accessToken);
    return session;
  }

  async refreshToken(session: Session): Promise<Session> {
    // SSI FastConnect không có refresh token riêng — cần login lại khi hết hạn
    return session;
  }

  async logout(): Promise<void> {
    // SSI không có endpoint logout — client chỉ cần bỏ token phía mình
    return;
  }
}
