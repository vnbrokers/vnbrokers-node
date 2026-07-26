import type { Session } from '../../../types/common';
import type { SSIAccessTokenResponse } from './auth.types';

export function mapSSIAuthResponse(raw: SSIAccessTokenResponse): Session {
  return {
    accessToken: raw.data.accessToken,
    // SSI FastConnect access tokens are typically valid for 8 hours
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  };
}
