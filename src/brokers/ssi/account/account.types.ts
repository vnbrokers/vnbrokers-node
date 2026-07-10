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
  avgPrice: number; // đơn vị: nghìn đồng theo API SSI
  marketPrice?: number;
}

export interface SSIListResponse<T> {
  status: number;
  message: string;
  data: T[];
}
