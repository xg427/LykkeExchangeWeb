import {RestApi} from '.';
import {RootStore} from '../stores/index';
import {connectUrls} from '../utils/authUtils';
import {ApiResponse} from './types';

export interface ProfileApi {
  fetchBaseCurrency: () => ApiResponse<any>;
  updateBaseCurrency: (baseCurrency: string) => ApiResponse<any>;
  getUserName: (token: string) => ApiResponse<any>;
}

export class RestProfileApi extends RestApi implements ProfileApi {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  fetchBaseCurrency = () => this.get('/assets/baseAsset');

  updateBaseCurrency = (baseCurrency: string) =>
    this.post('/assets/baseAsset', {BaseAsssetId: baseCurrency});

  getUserName = (token: string) => this.getAuth(connectUrls.info);
}

export default RestProfileApi;
