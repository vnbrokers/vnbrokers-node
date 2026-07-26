import { MarketStatus } from '../../../types/enums';
import type { Quote } from '../../../types/common';
import type { SSIQuoteRaw } from './market.types';

const STATUS_FROM_SSI: Record<SSIQuoteRaw['tradingStatus'], MarketStatus> = {
  PO: MarketStatus.PRE_OPEN,
  ATO: MarketStatus.PRE_OPEN,
  CT: MarketStatus.OPEN,
  ATC: MarketStatus.OPEN,
  C: MarketStatus.CLOSED,
  HALT: MarketStatus.HALTED,
};

export function mapSSIQuote(raw: SSIQuoteRaw): Quote {
  return {
    symbol: raw.symbol,
    bidPrice: raw.bidPrice1,
    askPrice: raw.askPrice1,
    lastPrice: raw.matchPrice,
    volume: raw.totalVolume,
    changePercent: raw.changePercent,
    marketStatus: STATUS_FROM_SSI[raw.tradingStatus],
    timestamp: new Date(raw.time).getTime(),
  };
}
