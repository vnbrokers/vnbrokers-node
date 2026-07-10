import type { Account, Balance, Position } from '../../../types/common';
import type { SSIAccountRaw, SSIBalanceRaw, SSIPositionRaw } from './account.types';

// SSI trả giá theo đơn vị nghìn đồng — chuẩn hóa về đồng (VND) cho nhất quán toàn lib
const SSI_PRICE_UNIT = 1000;

export function mapSSIAccount(raw: SSIAccountRaw): Account {
  return {
    accountId: raw.account,
    ownerName: raw.accountName,
    brokerName: 'ssi',
  };
}

export function mapSSIBalance(raw: SSIBalanceRaw): Balance {
  return {
    accountId: raw.account,
    cashBalance: raw.totalCash,
    availableCash: raw.withdrawableCash,
    totalAssetValue: raw.totalAsset,
    currency: 'VND',
  };
}

export function mapSSIPosition(raw: SSIPositionRaw): Position {
  return {
    accountId: raw.account,
    symbol: raw.symbol,
    quantity: raw.quantity,
    avgPrice: raw.avgPrice * SSI_PRICE_UNIT,
    marketPrice: raw.marketPrice ? raw.marketPrice * SSI_PRICE_UNIT : undefined,
  };
}
