import {Dialog} from '@lykkex/react-components';
import classnames from 'classnames';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import {
  DialogActionModel,
  DialogActionType,
  DialogModel
} from '../../models/dialogModel';

import './style.css';

export interface ClientDialogProps {
  dialog: DialogModel;
  onDialogConfirm: (dialog: DialogModel) => void;
  onDialogCancel?: (dialog: DialogModel) => void;
}

export class ClientDialog extends React.Component<ClientDialogProps> {
  @observable private isConfirmed = this.props.dialog.isConfirmed;

  render() {
    const dialogActions = this.props.dialog.actions
      .filter(
        (action: DialogActionModel) => action.type === DialogActionType.Submit
      )
      .map((action: DialogActionModel) => ({
        cssClass: 'btn-primary btn-block',
        onClick: () => this.props.onDialogConfirm(this.props.dialog),
        text: action.text
      }));

    return (
      <Dialog
        visible={this.props.dialog.visible}
        title={this.props.dialog.header}
        className={classnames('client-dialog', {
          'client-dialog_confirm-disabled': !this.isConfirmed
        })}
        // tslint:disable-next-line:jsx-no-lambda
        onCancel={() =>
          this.props.onDialogCancel &&
          this.props.onDialogCancel(this.props.dialog)}
        actions={dialogActions}
        description={this.renderDescription()}
      />
    );
  }

  private renderDescription = () => (
    <div>
      <div dangerouslySetInnerHTML={{__html: this.props.dialog.text}} />
      {this.props.dialog.actions.map(
        (action: DialogActionModel) =>
          action.type === DialogActionType.Checkbox &&
          this.renderCheckboxAction(action)
      )}
    </div>
  );

  private renderCheckboxAction = (action: DialogActionModel) => (
    <div className="form-group" key={action.text}>
      <div className="checkbox">
        <input
          id="action-checkbox"
          type="checkbox"
          className="radio__control"
          checked={action.done}
          // tslint:disable-next-line:jsx-no-lambda
          onChange={() => this.handleCheckboxChange(action)}
        />
        <label
          htmlFor="action-checkbox"
          className="control-label checkbox__label"
        >
          <span className="checkbox__label-text">{action.text}</span>
        </label>
      </div>
    </div>
  );

  private handleCheckboxChange = (action: DialogActionModel) => {
    action.done = !action.done;
    this.isConfirmed = this.props.dialog.isConfirmed;
  };
}

export default observer(ClientDialog);
