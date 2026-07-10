/**
 * Hợp đồng tối thiểu mà mỗi HttpClient riêng của từng broker (SSIHttpClient,
 * VndirectHttpClient...) phải cung cấp. Cho phép các Base*Service dùng chung
 * logic mà không phụ thuộc trực tiếp vào axios.
 */
export interface BaseHttpClient {
  get<T>(path: string, params?: Record<string, unknown>): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  put<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string, params?: Record<string, unknown>): Promise<T>;
  setAuthToken(token: string): void;
}
