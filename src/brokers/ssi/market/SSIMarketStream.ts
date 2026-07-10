import WebSocket from 'ws';
import type { Quote, Unsubscribe } from '../../../types/common';
import { mapSSIQuote } from './market.mapper';
import type { SSIQuoteRaw } from './market.types';

type Listener = (quote: Quote) => void;

/**
 * Quản lý 1 kết nối websocket dùng chung cho nhiều symbol,
 * tránh mỗi subscribe() lại mở 1 connection riêng.
 */
export class SSIMarketStream {
  private ws?: WebSocket;
  private readonly listeners = new Map<string, Set<Listener>>();

  constructor(private readonly url: string) {}

  subscribe(symbol: string, callback: Listener): Unsubscribe {
    this.ensureConnected();

    if (!this.listeners.has(symbol)) {
      this.listeners.set(symbol, new Set());
      this.send({ action: 'subscribe', symbol });
    }
    this.listeners.get(symbol)!.add(callback);

    return () => {
      const set = this.listeners.get(symbol);
      set?.delete(callback);
      if (set && set.size === 0) {
        this.listeners.delete(symbol);
        this.send({ action: 'unsubscribe', symbol });
      }
    };
  }

  private ensureConnected(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);
    this.ws.on('message', (raw: WebSocket.RawData) => {
      try {
        const parsed = JSON.parse(raw.toString()) as SSIQuoteRaw;
        const quote = mapSSIQuote(parsed);
        this.listeners.get(quote.symbol)?.forEach((cb) => cb(quote));
      } catch {
        // bỏ qua message không parse được (ping/pong, heartbeat...)
      }
    });
  }

  private send(payload: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }
}
