export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET', // ATO/ATC/MP are mapped by exchange-specific mappers
  STOP = 'STOP',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FILLED = 'FILLED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum MarketStatus {
  PRE_OPEN = 'PRE_OPEN',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  HALTED = 'HALTED',
}
