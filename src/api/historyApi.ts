import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface HistoryApi {
  fetchWalletHistory: (
    walletId: string,
    skip: number,
    take: number,
    assetId?: string,
    operationType?: string
  ) => ApiResponse<any>;
}

export class RestHistoryApi extends RestApi implements HistoryApi {
  fetchWalletHistory = (
    walletId: string,
    skip: number,
    take: number,
    assetId?: string,
    operationType?: string
  ) => {
    const query: any = {skip, take};

    if (assetId) {
      query.assetId = assetId;
    }

    if (operationType) {
      query.operationType = operationType;
    }

    return this.getWithQuery(`/history/wallet/${walletId}`, query);
  };
}

export default RestHistoryApi;
