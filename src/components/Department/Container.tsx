/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, IEntityRequest } from "../types";
import { fetchRequest, IState } from "./store";
import { View } from "./Presentation";

interface IContainerProps {
  match: any;
}

interface IDispatchProps {
  fetchRequest: typeof fetchRequest;
}

class Container extends React.Component<
  IState & IContainerProps & IDispatchProps
> {
  public componentDidMount() {
    this.props.fetchRequest(this.props.match.params);
  }
  public render() {
    return <View {...this.props} />;
  }
}

export const mapStateToProps = (state: IApplicationState) => state.department;

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  fetchRequest: (request: IEntityRequest) => dispatch(fetchRequest(request))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
