import { describe, expect, it } from 'vitest';
import { validateOrderRequest } from '../src/utils/validators';
import { OrderSide, OrderType } from '../src/types/enums';
import { BrokerError } from '../src/errors/BrokerError';

describe('validateOrderRequest', () => {
  const base = {
    accountId: '0001234567',
    symbol: 'VNM',
    side: OrderSide.BUY,
    type: OrderType.LIMIT,
    quantity: 100,
    price: 65000,
  };

  it('passes for valid limit order', () => {
    expect(() => validateOrderRequest(base, 'ssi')).not.toThrow();
  });

  it('throws when quantity <= 0', () => {
    expect(() => validateOrderRequest({ ...base, quantity: 0 }, 'ssi')).toThrow(BrokerError);
  });

  it('throws when LIMIT order has no price', () => {
    expect(() =>
      validateOrderRequest({ ...base, price: undefined }, 'ssi'),
    ).toThrow(BrokerError);
  });
});
