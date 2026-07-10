import type { AuthConfig } from '../../types/config';
import type { Session } from '../../types/common';
import type { BaseHttpClient } from './BaseHttpClient';

/**
 * Mỗi broker có luồng auth khác nhau (OTP, consumerId/secret, 2FA...)
 * nhưng đều phải trả về Session chuẩn hóa.
 */
export abstract class BaseAuthService {
  protected constructor(protected readonly http: BaseHttpClient) {}

  abstract login(credentials: AuthConfig): Promise<Session>;
  abstract refreshToken(session: Session): Promise<Session>;
  abstract logout(): Promise<void>;
}
