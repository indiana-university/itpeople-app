/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, ViewStateType, IUnit } from "../types";
import Unit from "./Presentation";
import * as unit from "./store";
import * as auth from "../SignIn/store";
import { Edit } from "./Presentation/Edit";

interface IContainerProps {
  match: any;
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IDispatchProps {
  fetchUnit: typeof unit.fetchUnit;
  save: typeof unit.saveUnitProfileRequest;
  deleteUnit: typeof unit.deleteUnit; //TODO
  edit: typeof unit.edit;
  cancel: typeof unit.cancel;
}

interface ICurrentUser {
  auth: auth.IState;
}

// tslint:disable-next-line:max-classes-per-file
class Container extends React.Component<
  unit.IState & ICurrentUser & IContainerProps & IDispatchProps
  > {
  public componentDidMount() {
    const request = this.props.match.params;
    this.props.fetchUnit(request);
  }

  public render() {
    const { view, edit, cancel, match } = this.props;
    return (
      <>
        {view == ViewStateType.Editing && (
          <>
            <Edit
              {...this.props}
              cancel={cancel}
              id={match.params.id}
            />
          </>
        )}
        {view == ViewStateType.Viewing && (
          <>
            <Unit
              {...this.props}
              edit={edit}
            />
          </>
        )}
      </>
    );
  }
}

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  ...state.unit,
  auth: state.auth
});

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  fetchUnit: request => dispatch(unit.fetchUnit(request)),
  edit: () => dispatch(unit.edit()),
  save: (u: IUnit) => dispatch(unit.saveUnitProfileRequest(u)),
  cancel: () => dispatch(unit.cancel()),
  deleteUnit: (u: IUnit) => dispatch(unit.deleteUnit(u))
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
