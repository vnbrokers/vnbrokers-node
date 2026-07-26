/** Raw SSI login response; field names follow the SSI FastConnect documentation */
export interface SSIAccessTokenResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
  };
}
