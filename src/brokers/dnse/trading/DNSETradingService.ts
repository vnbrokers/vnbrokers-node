import type { DNSEHttpClient } from '../client/DNSEHttpClient';
import { BrokerError, BrokerErrorCode } from '../../../errors/BrokerError';
import type { DNSEGetOrdersRequest, DNSEOrdersResponse } from '../native/dnse.types';

export class DNSETradingService {
  constructor(private readonly http: DNSEHttpClient) {}

  async getOrders(request: DNSEGetOrdersRequest): Promise<DNSEOrdersResponse> {
    const response = await this.http.request<DNSEOrdersResponse>(
      'GET',
      `/accounts/${encodeURIComponent(request.accountNo)}/orders`,
      {
        params: {
          marketType: request.marketType,
          orderCategory: request.orderCategory,
        },
        trading: true,
      },
    );
    return {
      ...response,
      orders: response.orders?.map((order) => ({
        ...order,
        id: normalizeOrderID((order as { id?: unknown }).id),
      })),
    };
  }
}

function normalizeOrderID(id: unknown): number | undefined {
  if (id === undefined || id === null) {
    return undefined;
  }
  if (typeof id === 'number') {
    return id;
  }
  if (typeof id === 'string' && /^\d+$/.test(id)) {
    const parsed = Number(id);
    if (Number.isSafeInteger(parsed)) {
      return parsed;
    }
  }
  throw new BrokerError({
    code: BrokerErrorCode.UNKNOWN,
    message: `DNSE returned an invalid order ID: ${String(id)}`,
    broker: 'dnse',
    raw: id,
  });
}
