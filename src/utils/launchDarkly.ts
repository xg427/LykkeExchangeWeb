// tslint:disable-next-line:no-var-requires
const ReactLaunchDarkly = require('react-launch-darkly');
export const LaunchDarkly = ReactLaunchDarkly.LaunchDarkly;
export const FeatureFlag = ReactLaunchDarkly.FeatureFlag;
export const identify = ReactLaunchDarkly.identify;

export const Feature = {
  ExportTradingHistory: 'export-trading-history',
  TwoFactorAuthentication: '2fa'
};
