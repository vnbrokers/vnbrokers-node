/** Response thô SSI trả về khi login — field name theo tài liệu SSI FastConnect */
export interface SSIAccessTokenResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
  };
}
