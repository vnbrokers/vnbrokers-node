/* eslint-disable no-console */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

let enabled = false;

export const logger = {
  enable(v: boolean) {
    enabled = v;
  },
  log(level: LogLevel, message: string, meta?: unknown) {
    if (!enabled) return;
    const prefix = `[vnbrokers:${level}]`;
    if (meta !== undefined) {
      console[level === 'debug' ? 'log' : level](prefix, message, meta);
    } else {
      console[level === 'debug' ? 'log' : level](prefix, message);
    }
  },
};
