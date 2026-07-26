import type { DNSEHttpClient } from '../client/DNSEHttpClient';
import type { DNSEGetInstrumentsRequest, DNSEInstrumentsResponse } from '../native/dnse.types';

export class DNSEMarketDataService {
  constructor(private readonly http: DNSEHttpClient) {}

  getInstruments(request: DNSEGetInstrumentsRequest = {}): Promise<DNSEInstrumentsResponse> {
    return this.http.request('GET', '/instruments', { params: request });
  }
}
