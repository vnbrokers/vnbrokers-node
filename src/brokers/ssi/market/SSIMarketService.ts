import { BaseMarketService } from '../../base/BaseMarketService';
import type { Quote, Unsubscribe } from '../../../types/common';
import type { SSIHttpClient } from '../client/SSIHttpClient';
import type { SSIQuoteResponse } from './market.types';
import { mapSSIQuote } from './market.mapper';
import { SSIMarketStream } from './SSIMarketStream';

export class SSIMarketService extends BaseMarketService {
  private stream?: SSIMarketStream;

  constructor(http: SSIHttpClient, private readonly wsUrl: string) {
    super(http);
  }

  async getQuote(symbol: string): Promise<Quote> {
    const res = await this.http.get<SSIQuoteResponse>('/api/v2/Market/Quote', { symbol });
    const first = res.data[0];
    if (!first) {
      throw new Error(`Không có dữ liệu giá cho mã ${symbol}`);
    }
    return mapSSIQuote(first);
  }

  subscribeQuote(symbol: string, callback: (quote: Quote) => void): Unsubscribe {
    if (!this.stream) {
      this.stream = new SSIMarketStream(this.wsUrl);
    }
    return this.stream.subscribe(symbol, callback);
  }
}
