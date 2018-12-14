// Copyright (C) 2018 The Trustees of Indiana University
// SPDX-License-Identifier: BSD-3-Clause

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../types";
import Unit from "./Presentation";
import * as unit from "./store";
import { Loader } from "../Loader";

interface IContainerProps {
  match: any;
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IDispatchProps {
  fetchRequest: typeof unit.fetchRequest;
}

// tslint:disable-next-line:max-classes-per-file
class Container extends React.Component<
  unit.IState & IContainerProps & IDispatchProps
> {
  public componentDidMount() {
    this.props.fetchRequest(this.props.match.params);
  }

  public render() {
    return (
      <Loader {...this.props}>
        {this.props.data && <Unit {...this.props.data} />}
      </Loader>
    );
  }
}

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  ...state.unit
});

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  fetchRequest: (request: unit.IUnitRequest) =>
    dispatch(unit.fetchRequest(request))
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
