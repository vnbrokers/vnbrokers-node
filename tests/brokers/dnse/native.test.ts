import { createHmac } from 'node:crypto';
import type { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { DNSEAuthService } from '../../../src/brokers/dnse/auth/DNSEAuthService';
import { DNSEHttpClient } from '../../../src/brokers/dnse/client/DNSEHttpClient';
import { DNSEMarketDataService } from '../../../src/brokers/dnse/marketdata/DNSEMarketDataService';
import { DNSETradingService } from '../../../src/brokers/dnse/trading/DNSETradingService';
import { BrokerError } from '../../../src/errors/BrokerError';

const fixedDate = new Date('2026-05-25T01:02:03.000Z');

function createClient(adapter: AxiosAdapter, tradingToken?: string): DNSEHttpClient {
  return new DNSEHttpClient(
    {
      apiKey: 'key',
      apiSecret: 'secret',
      tradingToken,
      baseUrl: 'https://openapi.dnse.test',
      timeoutMs: 1000,
    },
    { adapter, now: () => fixedDate, nonce: () => 'nonce' },
  );
}

function response(config: AxiosRequestConfig, data: unknown, status = 200) {
  return { config, data, headers: {}, status, statusText: 'OK' };
}

describe('DNSE native services', () => {
  it('signs the escaped pathname without query string', async () => {
    let captured: AxiosRequestConfig | undefined;
    const client = createClient((config) => {
      captured = config;
      return Promise.resolve(response(config, { data: [] }));
    });

    await client.request('GET', '/accounts/A%2FB/orders?ignored=true', { params: { page: 1 } });

    const signingString = '(request-target): get /accounts/A%2FB/orders\nx-aux-date: Mon, 25 May 2026 01:02:03 GMT\nnonce: nonce';
    const signature = encodeURIComponent(createHmac('sha256', 'secret').update(signingString).digest('base64'));
    expect(captured?.headers).toMatchObject({
      'X-API-Key': 'key',
      'X-Aux-Date': 'Mon, 25 May 2026 01:02:03 GMT',
      'X-Signature': `Signature keyId="key",algorithm="hmac-sha256",headers="(request-target) x-aux-date",signature="${signature}",nonce="nonce"`,
    });
    expect(captured?.params).toEqual({ page: 1 });
  });

  it('omits nonce from the signing string when nonce is empty', async () => {
    let captured: AxiosRequestConfig | undefined;
    const client = new DNSEHttpClient(
      { apiKey: 'key', apiSecret: 'secret', baseUrl: 'https://openapi.dnse.test', timeoutMs: 1000 },
      { adapter: (config) => { captured = config; return Promise.resolve(response(config, {})); }, now: () => fixedDate, nonce: () => '' },
    );

    await client.request('GET', '/instruments');

    expect(captured?.headers).toHaveProperty('X-Signature');
    expect(String((captured?.headers as Record<string, string>)['X-Signature'])).toContain('nonce=""');
  });

  it('sends auth contracts and preserves an existing token after an empty response', async () => {
    const calls: AxiosRequestConfig[] = [];
    const client = createClient((config) => {
      calls.push(config);
      return Promise.resolve(response(config, calls.length === 1 ? { code: 'SUCCESS' } : { tradingToken: '' }));
    }, 'old-token');
    const auth = new DNSEAuthService(client);

    await auth.sendEmailOTP();
    await expect(auth.getTradingToken({ otpType: 'EMAIL', passcode: '123456' })).rejects.toMatchObject({
      broker: 'dnse', raw: { tradingToken: '' },
    });
    expect(calls[0]?.url).toBe('/registration/send-email-otp');
    expect(calls[1]?.url).toBe('/registration/trading-token');
    expect(JSON.parse(String(calls[1]?.data))).toEqual({ otpType: 'EMAIL', passcode: '123456' });
    expect(client.getTradingToken()).toBe('old-token');

    const validClient = createClient((config) => Promise.resolve(response(config, { tradingToken: 'new-token' })));
    await new DNSEAuthService(validClient).getTradingToken({ otpType: 'EMAIL', passcode: '654321' });
    expect(validClient.getTradingToken()).toBe('new-token');
  });

  it('uses only signed API headers for market-data and omits undefined query values', async () => {
    let captured: AxiosRequestConfig | undefined;
    const marketData = new DNSEMarketDataService(createClient((config) => {
      captured = config;
      return Promise.resolve(response(config, { data: [], total: 0, page: 1, pageSize: 100 }));
    }, 'trading-token'));

    const result = await marketData.getInstruments({ symbol: 'ACB', limit: 1000, page: undefined });

    expect(result.total).toBe(0);
    expect(captured?.url).toBe('/instruments');
    expect(captured?.params).toEqual({ symbol: 'ACB', limit: 1000 });
    expect(captured?.headers).not.toHaveProperty('trading-token');
  });

  it('gets trading orders with escaped account path, optional queries, and token header', async () => {
    let captured: AxiosRequestConfig | undefined;
    const trading = new DNSETradingService(createClient((config) => {
      captured = config;
      return Promise.resolve(response(config, { orders: [{ id: '42', symbol: 'VN30F' }] }));
    }, 'trading-token'));

    const result = await trading.getOrders({ accountNo: '0001/179019', marketType: 'DERIVATIVE', orderCategory: 'NORMAL' });

    expect(result.orders?.[0]?.id).toBe(42);
    expect(captured?.url).toBe('/accounts/0001%2F179019/orders');
    expect(captured?.params).toEqual({ marketType: 'DERIVATIVE', orderCategory: 'NORMAL' });
    expect(captured?.headers).toMatchObject({ 'trading-token': 'trading-token', 'X-API-Key': 'key' });
    expect((captured?.headers as { toJSON: () => object }).toJSON()).not.toHaveProperty('Content-Type');
    expect(captured?.data).toBeUndefined();
  });

  it('adds each optional order query independently', async () => {
    const calls: AxiosRequestConfig[] = [];
    const trading = new DNSETradingService(createClient((config) => {
      calls.push(config);
      return Promise.resolve(response(config, { orders: [] }));
    }, 'trading-token'));

    await trading.getOrders({ accountNo: '0001179019', marketType: 'DERIVATIVE' });
    await trading.getOrders({ accountNo: '0001179019', orderCategory: 'NORMAL' });

    expect(calls[0]?.params).toEqual({ marketType: 'DERIVATIVE' });
    expect(calls[1]?.params).toEqual({ orderCategory: 'NORMAL' });
  });

  it('rejects missing trading token, HTTP errors, and business envelopes with raw payload', async () => {
    const trading = new DNSETradingService(createClient((config) => Promise.resolve(response(config, { orders: [] }))));
    await expect(trading.getOrders({ accountNo: '0001179019' })).rejects.toMatchObject({ broker: 'dnse' });

    const business = createClient((config) => Promise.resolve(response(config, { code: 'INVALID', message: 'rejected' })));
    await expect(business.request('GET', '/instruments')).rejects.toMatchObject({
      broker: 'dnse', raw: { code: 'INVALID', message: 'rejected' },
    });

    const http = createClient((config) => Promise.reject(new AxiosError(
      'bad request',
      'ERR_BAD_REQUEST',
      config,
      undefined,
      response(config, { code: 'BAD' }, 400),
    )));
    await expect(http.request('GET', '/instruments')).rejects.toBeInstanceOf(BrokerError);
  });
});
