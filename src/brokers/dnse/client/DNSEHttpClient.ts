import axios, { type AxiosAdapter, type AxiosInstance, type Method } from 'axios';
import { createHmac, randomUUID } from 'node:crypto';
import { BrokerError, BrokerErrorCode } from '../../../errors/BrokerError';
import type { DNSEResolvedConfig } from '../dnse.config';

export interface DNSEHttpClientOptions {
  adapter?: AxiosAdapter;
  now?: () => Date;
  nonce?: () => string;
}

interface DNSERequestOptions {
  body?: unknown;
  params?: object;
  trading?: boolean;
}

export class DNSEHttpClient {
  private readonly instance: AxiosInstance;
  private readonly now: () => Date;
  private readonly nonce: () => string;
  private tradingToken?: string;

  constructor(
    private readonly config: DNSEResolvedConfig,
    options: DNSEHttpClientOptions = {},
  ) {
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
      adapter: options.adapter,
    });
    this.now = options.now ?? (() => new Date());
    this.nonce = options.nonce ?? randomUUID;
    this.tradingToken = config.tradingToken;
  }

  getTradingToken(): string | undefined {
    return this.tradingToken;
  }

  setTradingToken(token: string): void {
    this.tradingToken = token;
  }

  async request<T>(method: Method, path: string, options: DNSERequestOptions = {}): Promise<T> {
    if (options.trading && !this.tradingToken) {
      throw new BrokerError({
        code: BrokerErrorCode.AUTH_FAILED,
        message: 'DNSE requires a trading token for trading requests',
        broker: 'dnse',
      });
    }

    const headers = this.sign(method, path);
    if (options.trading) {
      headers['trading-token'] = this.tradingToken!;
    }
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await this.instance.request<T>({
        method,
        url: path,
        params: omitUndefined(options.params),
        data: options.body,
        headers,
      });
      this.throwBusinessError(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof BrokerError) {
        throw error;
      }
      throw this.toBrokerError(error);
    }
  }

  private sign(method: Method, path: string): Record<string, string> {
    const date = this.now().toUTCString();
    const nonce = this.nonce();
    const pathname = new URL(path, this.config.baseUrl).pathname;
    let signingString = `(request-target): ${method.toLowerCase()} ${pathname}\nx-aux-date: ${date}`;
    if (nonce) {
      signingString += `\nnonce: ${nonce}`;
    }
    const signature = encodeURIComponent(
      createHmac('sha256', this.config.apiSecret).update(signingString).digest('base64'),
    );

    return {
      'X-API-Key': this.config.apiKey,
      'X-Aux-Date': date,
      'X-Signature': `Signature keyId="${this.config.apiKey}",algorithm="hmac-sha256",headers="(request-target) x-aux-date",signature="${signature}",nonce="${nonce}"`,
    };
  }

  private throwBusinessError(data: unknown): void {
    if (!isDNSEBusinessError(data)) {
      return;
    }
    const record = data as Record<string, unknown>;
    throw new BrokerError({
      code: BrokerErrorCode.UNKNOWN,
      message: stringValue(record.message) ?? 'DNSE rejected the request',
      broker: 'dnse',
      raw: data,
    });
  }

  private toBrokerError(error: unknown): BrokerError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      return new BrokerError({
        code: status === 401 ? BrokerErrorCode.TOKEN_EXPIRED : BrokerErrorCode.NETWORK_ERROR,
        message: error.response
          ? `DNSE API error: ${status}`
          : 'Unable to connect to the DNSE API',
        broker: 'dnse',
        raw: error.response?.data ?? error.message,
      });
    }
    return new BrokerError({
      code: BrokerErrorCode.UNKNOWN,
      message: 'Unknown error while calling the DNSE API',
      broker: 'dnse',
      raw: error,
    });
  }
}

function omitUndefined(params: DNSERequestOptions['params']): Record<string, string | number> | undefined {
  if (!params) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, string | number] => typeof entry[1] === 'string' || typeof entry[1] === 'number',
    ),
  );
}

function isDNSEBusinessError(data: unknown): boolean {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }
  const record = data as Record<string, unknown>;
  return record.success === false
    || Boolean(record.error)
    || (typeof record.status === 'number' && record.status >= 400)
    || (typeof record.code === 'string' && record.code !== '' && record.code !== 'SUCCESS' && record.code !== '0');
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}
