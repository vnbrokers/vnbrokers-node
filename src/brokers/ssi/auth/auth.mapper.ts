import type { Session } from '../../../types/common';
import type { SSIAccessTokenResponse } from './auth.types';

export function mapSSIAuthResponse(raw: SSIAccessTokenResponse): Session {
  return {
    accessToken: raw.data.accessToken,
    // SSI FastConnect access token thường có hiệu lực 8 tiếng
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  };
}
