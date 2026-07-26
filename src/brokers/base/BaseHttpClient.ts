/**
 * Minimum contract that each broker-specific HttpClient (SSIHttpClient,
 * VndirectHttpClient, etc.) must provide. This lets Base*Service implementations
 * share logic without depending directly on axios.
 */
export interface BaseHttpClient {
  get<T>(path: string, params?: Record<string, unknown>): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  put<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string, params?: Record<string, unknown>): Promise<T>;
  setAuthToken(token: string): void;
}
