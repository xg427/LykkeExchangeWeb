import {MenuItem, Select} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export class ProfilePage extends React.Component<RootStoreProps> {
  private readonly assetStore = this.props.rootStore!.assetStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  componentDidMount() {
    this.uiStore.activeHeaderMenuItem = MenuItem.Settings;
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="profile-page">
        <div className="container">
          <h2 className="profile-page__title">Profile</h2>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="firstName" className="control-label">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="form-control"
                value={this.profileStore.firstName}
                disabled
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="lastName" className="control-label">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="form-control"
                value={this.profileStore.lastName}
                disabled
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="email" className="control-label">
                Email
              </label>
              <input
                id="email"
                type="text"
                className="form-control"
                value={this.profileStore.email}
                disabled
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="baseAsset" className="control-label">
                Base Asset
              </label>
              <Select
                options={this.assetStore.baseAssets.sort((a: any, b: any) =>
                  a.name.localeCompare(b.name)
                )}
                labelKey="name"
                valueKey="id"
                onChange={this.handleChangeBaseAsset}
                value={this.profileStore.baseAsset}
                placeholder="Select..."
                searchPlaceholder="Enter asset name or select from list..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleChangeBaseAsset = (asset: any) => {
    this.analyticsService.track(AnalyticsEvent.ChangeBaseAsset(asset.id));
    this.profileStore.setBaseAsset(asset);
  };
}

export default inject(STORE_ROOT)(observer(ProfilePage));
