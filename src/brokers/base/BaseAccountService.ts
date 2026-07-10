import type { Account, Balance, Position } from '../../types/common';
import type { BaseHttpClient } from './BaseHttpClient';

export abstract class BaseAccountService {
  protected constructor(protected readonly http: BaseHttpClient) {}

  abstract getAccountInfo(): Promise<Account>;
  abstract getBalance(accountId: string): Promise<Balance>;
  abstract getPositions(accountId: string): Promise<Position[]>;
}
