import * as classNames from 'classnames';
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps
} from 'formik';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AssetModel, DepositCreditCardModel, GatewayUrls} from '../../models';
import {moneyCeil} from '../../utils';
import {AmountInput} from '../AmountInput';
import {FormSelect} from '../FormSelect';
import {NumberFormat} from '../NumberFormat';

import './style.css';

export interface DepositCreditCardFormProps extends RootStoreProps {
  asset: AssetModel;
  onDisclaimerError: () => void;
  onSuccess: (gatewayUrls: GatewayUrls) => void;
  handleViewTermsOfUse?: () => void;
  handleGoBack?: (source: string) => void;
}

export const DepositCreditCardForm: React.SFC<DepositCreditCardFormProps> = ({
  rootStore,
  asset,
  handleGoBack,
  handleViewTermsOfUse,
  onDisclaimerError,
  onSuccess
}) => {
  const {
    catalogsStore: {countries},
    depositStore: {fetchBankCardPaymentUrl, newDeposit: deposit, feePercentage}
  } = rootStore!;
  const countryOptions = countries.map(c => ({
    label: c.name,
    value: c.id
  }));
  const requiredErrorMessage = (fieldName: string) =>
    `Field ${fieldName} should not be empty`;
  const DISCLAIMER_ERROR_MESSAGE = 'User has pending disclaimer';
  const DAILY_LIMIT_ERROR_MESSAGE = 'Credit card deposit limits reached.';

  return (
    <Formik
      initialValues={deposit}
      validationSchema={Yup.object().shape({
        address: Yup.string()
          .trim()
          .required(requiredErrorMessage('Address')),
        amount: Yup.number()
          .moreThan(0, requiredErrorMessage('Amount'))
          .required(requiredErrorMessage('Amount')),
        city: Yup.string()
          .trim()
          .required(requiredErrorMessage('City')),
        country: Yup.string()
          .trim()
          .required(requiredErrorMessage('Country')),
        firstName: Yup.string()
          .trim()
          .required(requiredErrorMessage('First Name')),
        lastName: Yup.string()
          .trim()
          .required(requiredErrorMessage('Last Name')),
        zip: Yup.string()
          .trim()
          .required(requiredErrorMessage('Zip'))
      })}
      // tslint:disable-next-line:jsx-no-lambda
      onSubmit={async (
        values: DepositCreditCardModel,
        {
          setErrors,
          setStatus,
          setSubmitting
        }: FormikActions<DepositCreditCardModel>
      ) => {
        setStatus(null);
        deposit.update(values);
        try {
          const gatewayUrls = await fetchBankCardPaymentUrl(deposit);
          onSuccess(gatewayUrls);
        } catch (err) {
          if (err.errMessages) {
            setErrors(err.errMessages);
            if (
              err.errMessages.assetId &&
              err.errMessages.assetId === DISCLAIMER_ERROR_MESSAGE
            ) {
              onDisclaimerError();
            }
            window.scrollTo(0, 0);
          } else {
            setStatus(err.message);
          }
          setSubmitting(false);
        }
      }}
      // tslint:disable-next-line:jsx-no-lambda
      render={(formikBag: FormikProps<DepositCreditCardModel>) => (
        <Form className="deposit-credit-card-form">
          <div className="separator" />
          <Field
            name="amount"
            render={({field, form}: FieldProps<DepositCreditCardModel>) => (
              <div
                className={classNames('form-group inline-form', {
                  'has-error': form.errors[field.name]
                })}
              >
                <div className="row">
                  <div className="col-sm-4">
                    <label htmlFor={field.name} className="control-label">
                      Amount
                    </label>
                  </div>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <div className="input-group-addon addon-text">
                        {asset && asset.name}
                      </div>
                      <div className="error-bar" />
                      <AmountInput
                        onChange={field.onChange}
                        value={field.value || ''}
                        name={field.name}
                        decimalLimit={asset && asset.accuracy}
                      />
                      {form.errors[field.name] && (
                        <span className="help-block">
                          {form.errors[field.name] ===
                          DAILY_LIMIT_ERROR_MESSAGE ? (
                            <span>
                              Credit card deposit limits reached.{' '}
                              <a
                                className="link"
                                href="https://www.lykke.com/cp/wallet-fees-and-limits"
                                target="_blank"
                              >
                                Read More
                              </a>
                            </span>
                          ) : (
                            form.errors[field.name]
                          )}
                        </span>
                      )}
                      {!!feePercentage && (
                        <div className="fee-label">
                          Fee: {asset && asset.name}{' '}
                          {asset && (
                            <NumberFormat
                              value={moneyCeil(field.value * feePercentage)}
                              accuracy={asset.accuracy}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
          <div className="separator" />

          <div className="row">
            <div className="col-sm-6">
              <Field
                name="firstName"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames('form-group', {
                      'has-error': form.errors[field.name]
                    })}
                  >
                    <label htmlFor={field.name} className="control-label">
                      First Name
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="col-sm-6">
              <Field
                name="lastName"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames('form-group', {
                      'has-error': form.errors[field.name]
                    })}
                  >
                    <label htmlFor={field.name} className="control-label">
                      Last Name
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <Field
                name="country"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames('form-group', {
                      'has-error': form.errors[field.name]
                    })}
                  >
                    <label htmlFor={field.name} className="control-label">
                      Country
                    </label>
                    <div className="error-bar" />
                    <FormSelect options={countryOptions} {...field} />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <Field
                name="city"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames('form-group', {
                      'has-error': form.errors[field.name]
                    })}
                  >
                    <label htmlFor={field.name} className="control-label">
                      City
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="col-sm-6">
              <Field
                name="zip"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames('form-group', {
                      'has-error': form.errors[field.name]
                    })}
                  >
                    <label htmlFor={field.name} className="control-label">
                      ZIP
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <Field
                name="address"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames('form-group', {
                      'has-error': form.errors[field.name]
                    })}
                  >
                    <label htmlFor={field.name} className="control-label">
                      Address
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <Field
                name="phone"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames('form-group', {
                      'has-error': form.errors[field.name]
                    })}
                  >
                    <label htmlFor={field.name} className="control-label">
                      Phone Number
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="tel"
                      {...field}
                      className="form-control"
                      disabled={true}
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="col-sm-6">
              <Field
                name="email"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames('form-group', {
                      'has-error': form.errors[field.name]
                    })}
                  >
                    <label htmlFor={field.name} className="control-label">
                      E-mail
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="email"
                      {...field}
                      className="form-control"
                      disabled={true}
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="deposit-credit-card-form__links">
            <a
              className="link"
              href="https://www.lykke.com/terms_of_use"
              target="_blank"
              onClick={handleViewTermsOfUse}
            >
              Terms of Use
            </a>
          </div>

          <div
            className={classNames('deposit-credit-card-form__actions', {
              'has-error': formikBag.status
            })}
          >
            <input
              type="submit"
              value="Cash In"
              className="btn btn--primary"
              disabled={formikBag.isSubmitting || !formikBag.isValid}
            />
            {!!formikBag.status && (
              <div className="help-block">{formikBag.status}</div>
            )}
            <Link
              to={ROUTE_WALLETS}
              className="btn btn--flat"
              onClick={() => handleGoBack && handleGoBack('button')}
            >
              Cancel and go back
            </Link>
          </div>
        </Form>
      )}
    />
  );
};

export default inject(STORE_ROOT)(observer(DepositCreditCardForm));
