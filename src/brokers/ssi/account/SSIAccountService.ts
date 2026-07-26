import { BaseAccountService } from '../../base/BaseAccountService';
import type { Account, Balance, Position } from '../../../types/common';
import type { SSIHttpClient } from '../client/SSIHttpClient';
import type { SSIAccountRaw, SSIBalanceRaw, SSIListResponse, SSIPositionRaw } from './account.types';
import { mapSSIAccount, mapSSIBalance, mapSSIPosition } from './account.mapper';

export class SSIAccountService extends BaseAccountService {
  constructor(http: SSIHttpClient) {
    super(http);
  }

  async getAccountInfo(): Promise<Account> {
    const res = await this.http.get<SSIListResponse<SSIAccountRaw>>('/api/v2/Trading/accounts');
    const first = res.data[0];
    if (!first) {
      throw new Error('No SSI accounts found');
    }
    return mapSSIAccount(first);
  }

  async getBalance(accountId: string): Promise<Balance> {
    const res = await this.http.get<SSIListResponse<SSIBalanceRaw>>('/api/v2/Trading/cashAcctBal', {
      account: accountId,
    });
    const first = res.data[0];
    if (!first) {
      throw new Error(`No balance found for account ${accountId}`);
    }
    return mapSSIBalance(first);
  }

  async getPositions(accountId: string): Promise<Position[]> {
    const res = await this.http.get<SSIListResponse<SSIPositionRaw>>('/api/v2/Trading/stockPosition', {
      account: accountId,
    });
    return res.data.map(mapSSIPosition);
  }
}
