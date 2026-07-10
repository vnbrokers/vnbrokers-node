import { OrderSide, OrderStatus, OrderType } from '../../../types/enums';
import type { Order, OrderRequest, OrderResult } from '../../../types/common';
import type { SSIOrderPlaceResponse, SSIOrderRaw } from './order.types';

const SIDE_TO_SSI: Record<OrderSide, 'NB' | 'NS'> = {
  [OrderSide.BUY]: 'NB',
  [OrderSide.SELL]: 'NS',
};

const SIDE_FROM_SSI: Record<'NB' | 'NS', OrderSide> = {
  NB: OrderSide.BUY,
  NS: OrderSide.SELL,
};

const TYPE_TO_SSI: Record<OrderType, 'LO' | 'MP'> = {
  [OrderType.LIMIT]: 'LO',
  [OrderType.MARKET]: 'MP',
  [OrderType.STOP]: 'LO', // SSI không có stop order thuần — xử lý phía client nếu cần
};

const TYPE_FROM_SSI: Record<SSIOrderRaw['orderType'], OrderType> = {
  LO: OrderType.LIMIT,
  MP: OrderType.MARKET,
  ATO: OrderType.MARKET,
  ATC: OrderType.MARKET,
};

const STATUS_FROM_SSI: Record<SSIOrderRaw['orderStatus'], OrderStatus> = {
  WA: OrderStatus.PENDING,
  PF: OrderStatus.PARTIALLY_FILLED,
  FF: OrderStatus.FILLED,
  CL: OrderStatus.CANCELLED,
  RJ: OrderStatus.REJECTED,
};

export function mapOrderRequestToSSI(order: OrderRequest) {
  return {
    account: order.accountId,
    symbol: order.symbol,
    buySell: SIDE_TO_SSI[order.side],
    orderType: TYPE_TO_SSI[order.type],
    quantity: order.quantity,
    price: order.price ?? 0,
    requestID: order.clientOrderId,
  };
}

export function mapSSIOrderResult(raw: SSIOrderPlaceResponse): OrderResult {
  return {
    orderId: raw.data.orderId,
    clientOrderId: raw.data.requestID,
    status: OrderStatus.PENDING,
    submittedAt: Date.now(),
  };
}

export function mapSSIOrder(raw: SSIOrderRaw): Order {
  return {
    orderId: raw.orderId,
    accountId: raw.account,
    symbol: raw.symbol,
    side: SIDE_FROM_SSI[raw.side],
    type: TYPE_FROM_SSI[raw.orderType],
    quantity: raw.quantity,
    price: raw.price,
    status: STATUS_FROM_SSI[raw.orderStatus],
    filledQuantity: raw.filledQuantity,
    avgFillPrice: raw.avgFillPrice,
    createdAt: new Date(raw.createdDate).getTime(),
    updatedAt: new Date(raw.modifiedDate).getTime(),
  };
}
