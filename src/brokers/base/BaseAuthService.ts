import type { AuthConfig } from '../../types/config';
import type { Session } from '../../types/common';
import type { BaseHttpClient } from './BaseHttpClient';

/**
 * Each broker has a different authentication flow (OTP, consumerId/secret, 2FA...)
 * but they must all return a normalized Session.
 */
export abstract class BaseAuthService {
  protected constructor(protected readonly http: BaseHttpClient) {}

  abstract login(credentials: AuthConfig): Promise<Session>;
  abstract refreshToken(session: Session): Promise<Session>;
  abstract logout(): Promise<void>;
}
