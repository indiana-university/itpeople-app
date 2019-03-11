/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, IUnit } from "../types";
import Units from "./Presentation";
import * as units from "./store";
import { Loader } from "../Loader";
import { closeModal } from "../layout/Modal";

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IDispatchProps {
  fetchRequest: typeof units.fetchUnits;
  closeModal: typeof closeModal;
  deleteUnit: typeof units.deleteUnit;
}

// tslint:disable-next-line:max-classes-per-file
class Container extends React.Component<units.IState & IDispatchProps> {
  public componentDidMount() {
    this.props.fetchRequest();
  }

  public render() {
    return (
      <Loader {...this.props}>
        {this.props.data && <Units state={this.props} closeModal={this.props.closeModal} deleteUnit={this.props.deleteUnit} />}
      </Loader>
    );
  }
}

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  ...state.units
});

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  fetchRequest: () => dispatch(units.fetchUnits()),
  closeModal: () => dispatch(closeModal()),
  deleteUnit: (unit: IUnit) => dispatch(units.deleteUnit(unit))
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
