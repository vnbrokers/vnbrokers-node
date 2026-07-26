export interface SSIAccountRaw {
  account: string;
  accountName?: string;
}

export interface SSIBalanceRaw {
  account: string;
  totalCash: number;
  withdrawableCash: number;
  totalAsset: number;
}

export interface SSIPositionRaw {
  account: string;
  symbol: string;
  quantity: number;
  avgPrice: number; // Unit: thousands of VND according to the SSI API
  marketPrice?: number;
}

export interface SSIListResponse<T> {
  status: number;
  message: string;
  data: T[];
}
