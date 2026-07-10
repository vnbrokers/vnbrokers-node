import { BaseOrderService } from '../../base/BaseOrderService';
import type { Order, OrderRequest, OrderResult } from '../../../types/common';
import type { SSIHttpClient } from '../client/SSIHttpClient';
import type { SSIListResponse, SSIOrderPlaceResponse, SSIOrderRaw } from './order.types';
import { mapOrderRequestToSSI, mapSSIOrder, mapSSIOrderResult } from './order.mapper';

export class SSIOrderService extends BaseOrderService {
  constructor(http: SSIHttpClient) {
    super(http);
  }

  async place(order: OrderRequest): Promise<OrderResult> {
    const payload = mapOrderRequestToSSI(order);
    const raw = await this.http.post<SSIOrderPlaceResponse>('/api/v2/Trading/NewOrder', payload);
    return mapSSIOrderResult(raw);
  }

  async cancel(accountId: string, orderId: string): Promise<boolean> {
    const res = await this.http.post<{ status: number }>('/api/v2/Trading/CancelOrder', {
      account: accountId,
      orderId,
    });
    return res.status === 0;
  }

  async getHistory(accountId: string): Promise<Order[]> {
    const res = await this.http.get<SSIListResponse<SSIOrderRaw>>('/api/v2/Trading/orderHistory', {
      account: accountId,
    });
    return res.data.map(mapSSIOrder);
  }
}
