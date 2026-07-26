import type { Quote, Unsubscribe } from '../../types/common';
import type { BaseHttpClient } from './BaseHttpClient';

export abstract class BaseMarketService {
  protected constructor(protected readonly http: BaseHttpClient) {}

  abstract getQuote(symbol: string): Promise<Quote>;
  abstract subscribeQuote(symbol: string, callback: (quote: Quote) => void): Unsubscribe;
}
