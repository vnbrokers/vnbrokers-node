import type { OrderRequest } from '../types/common';
import { OrderType } from '../types/enums';
import { BrokerError, BrokerErrorCode } from '../errors/BrokerError';

export function validateOrderRequest(order: OrderRequest, broker: string): void {
  if (order.quantity <= 0) {
    throw new BrokerError({
      code: BrokerErrorCode.INVALID_ORDER,
      message: 'Khối lượng đặt lệnh phải > 0',
      broker,
    });
  }
  if (order.type === OrderType.LIMIT && (order.price === undefined || order.price <= 0)) {
    throw new BrokerError({
      code: BrokerErrorCode.INVALID_ORDER,
      message: 'Lệnh LIMIT bắt buộc phải có price > 0',
      broker,
    });
  }
}
