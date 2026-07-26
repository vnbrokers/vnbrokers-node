export interface SSIQuoteRaw {
  symbol: string;
  bidPrice1: number;
  askPrice1: number;
  matchPrice: number;
  totalVolume: number;
  changePercent: number;
  tradingStatus: 'PO' | 'ATO' | 'CT' | 'ATC' | 'C' | 'HALT';
  time: string;
}

export interface SSIQuoteResponse {
  status: number;
  message: string;
  data: SSIQuoteRaw[];
}
