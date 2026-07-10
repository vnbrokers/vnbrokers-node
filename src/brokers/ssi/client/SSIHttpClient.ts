import axios, { type AxiosInstance } from 'axios';
import type { BaseHttpClient } from '../../base/BaseHttpClient';
import type { SSIResolvedConfig } from '../ssi.config';
import { BrokerError, BrokerErrorCode } from '../../../errors/BrokerError';

/**
 * Wrapper axios riêng cho SSI: gắn header, xử lý timeout,
 * và chuẩn hóa lỗi HTTP thành BrokerError trước khi ném ra ngoài.
 */
export class SSIHttpClient implements BaseHttpClient {
  private readonly instance: AxiosInstance;

  constructor(config: SSIResolvedConfig) {
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setAuthToken(token: string): void {
    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.wrap(() => this.instance.get<T>(path, { params }));
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.wrap(() => this.instance.post<T>(path, body));
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.wrap(() => this.instance.put<T>(path, body));
  }

  async delete<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.wrap(() => this.instance.delete<T>(path, { params }));
  }

  private async wrap<T>(fn: () => Promise<{ data: T }>): Promise<T> {
    try {
      const res = await fn();
      return res.data;
    } catch (err) {
      throw this.toBrokerError(err);
    }
  }

  private toBrokerError(err: unknown): BrokerError {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 401) {
        return new BrokerError({
          code: BrokerErrorCode.TOKEN_EXPIRED,
          message: 'SSI token expired hoặc không hợp lệ',
          broker: 'ssi',
          raw: err.response?.data,
        });
      }
      if (status === 429) {
        return new BrokerError({
          code: BrokerErrorCode.RATE_LIMITED,
          message: 'SSI API bị rate limit',
          broker: 'ssi',
          raw: err.response?.data,
        });
      }
      if (!err.response) {
        return new BrokerError({
          code: BrokerErrorCode.NETWORK_ERROR,
          message: 'Không kết nối được tới SSI API',
          broker: 'ssi',
          raw: err.message,
        });
      }
      return new BrokerError({
        code: BrokerErrorCode.UNKNOWN,
        message: `SSI API lỗi: ${status}`,
        broker: 'ssi',
        raw: err.response?.data,
      });
    }
    return new BrokerError({
      code: BrokerErrorCode.UNKNOWN,
      message: 'Lỗi không xác định khi gọi SSI API',
      broker: 'ssi',
      raw: err,
    });
  }
}
