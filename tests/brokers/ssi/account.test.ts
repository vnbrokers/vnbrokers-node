import { describe, expect, it } from 'vitest';
import { mapSSIAccount, mapSSIBalance, mapSSIPosition } from '../../../src/brokers/ssi/account/account.mapper';
import mock from '../../mocks/ssi.mock.json';

describe('SSI account mapper', () => {
  it('maps account info correctly', () => {
    const raw = mock.accounts.data[0]!;
    const account = mapSSIAccount(raw);
    expect(account).toEqual({
      accountId: '0001234567',
      ownerName: 'NGUYEN VAN A',
      brokerName: 'ssi',
    });
  });

  it('maps balance correctly', () => {
    const raw = mock.balance.data[0]!;
    const balance = mapSSIBalance(raw);
    expect(balance.cashBalance).toBe(50000000);
    expect(balance.availableCash).toBe(45000000);
    expect(balance.currency).toBe('VND');
  });

  it('maps position price from nghin-dong to dong', () => {
    const raw = mock.positions.data[0]!;
    const position = mapSSIPosition(raw);
    expect(position.symbol).toBe('VNM');
    expect(position.avgPrice).toBe(65500); // 65.5 * 1000
    expect(position.marketPrice).toBe(67200); // 67.2 * 1000
  });
});
