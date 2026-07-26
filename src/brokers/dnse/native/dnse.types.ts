export interface DNSESendEmailOTPResponse {
  code?: string;
  message?: string;
  status?: number;
}

export interface DNSETradingTokenRequest {
  otpType: string;
  passcode: string;
}

export interface DNSETradingTokenResponse {
  tradingToken?: string;
}

export interface DNSEGetInstrumentsRequest {
  symbol?: string;
  limit?: number;
  page?: number;
}

export interface DNSEInstrument {
  symbol?: string;
  marketId?: string;
  securityGroupId?: string;
  symbolType?: string;
  listedDate?: string;
  shortName?: string;
  name?: string;
  indexName?: string[];
}

export interface DNSEInstrumentsResponse {
  data?: DNSEInstrument[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface DNSEGetOrdersRequest {
  accountNo: string;
  marketType?: string;
  orderCategory?: string;
}

export interface DNSEOrder {
  id?: number;
  investorId?: string;
  side?: string;
  accountNo?: string;
  symbol?: string;
  price?: number | null;
  priceSecure?: number | null;
  averagePrice?: number | null;
  quantity?: number | null;
  fillQuantity?: number | null;
  canceledQuantity?: number | null;
  leaveQuantity?: number | null;
  lastQuantity?: number | null;
  lastPrice?: number | null;
  orderType?: string;
  orderCategory?: string;
  orderStatus?: string;
  loanPackageId?: number;
  marketType?: string;
  transDate?: string;
  taxRate?: number | null;
  exchangeFeeRate?: number | null;
  feeRate?: number | null;
  error?: string;
  metadata?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface DNSEOrdersResponse {
  orders?: DNSEOrder[];
}
