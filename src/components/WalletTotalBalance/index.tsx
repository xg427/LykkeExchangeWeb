// import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

interface WalletTotalBalanceProps extends RootStoreProps {
  wallet: WalletModel;
}

export const WalletTotalBalance: React.SFC<WalletTotalBalanceProps> = ({
  wallet,
  rootStore
}) => (
  <div className="wallet__total">
    <div className="wallet__total-balance">Total balance</div>
    <h3 className="wallet__total-balance-value">
      {wallet.totalBalance.balance.toFixed(2)}{' '}
      {rootStore!.profileStore.baseCurrency}
    </h3>
  </div>
);

export default inject(STORE_ROOT)(observer(WalletTotalBalance));
