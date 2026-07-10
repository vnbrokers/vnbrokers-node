import type { Order, OrderRequest, OrderResult } from '../../types/common';
import type { BaseHttpClient } from './BaseHttpClient';

export abstract class BaseOrderService {
  protected constructor(protected readonly http: BaseHttpClient) {}

  abstract place(order: OrderRequest): Promise<OrderResult>;
  abstract cancel(accountId: string, orderId: string): Promise<boolean>;
  abstract getHistory(accountId: string): Promise<Order[]>;
}
