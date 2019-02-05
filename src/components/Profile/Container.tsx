/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, IEntityRequest } from "../types";
import {View} from "./Presentation";
import {
  fetchRequest,
  fetchMembershipsRequest,
  IState,
  toggleUnit
} from "./store";

interface IProfileProps {
  match: any;
  path: string;
}
interface IPropsFromDispatch {
  profileFetchRequest: typeof fetchRequest;
  fetchMembershipsRequest: typeof fetchMembershipsRequest;
  // profileUpdateRequest: typeof updateRequest;
  toggleUnit: typeof toggleUnit;
}

class Container extends React.Component<
  IState & IProfileProps & IPropsFromDispatch
> {
  public isMyProfile() {
    return this.props.match.params.id === undefined;
  }

  public componentDidMount() {
    const id = this.isMyProfile() ? 0 : Number(this.props.match.params.id);
    this.props.profileFetchRequest({ id });
    this.props.fetchMembershipsRequest({ id });
  }

  public render() {
    return (
      <View {...this.props} />
    );
  }
}

const mapStateToProps = (state: IApplicationState) => state.profile;

const mapDispatchToProps = (dispatch: Dispatch): IPropsFromDispatch => ({
  profileFetchRequest: (request: IEntityRequest) => dispatch(fetchRequest(request)),
  fetchMembershipsRequest: (request: IEntityRequest) => dispatch(fetchMembershipsRequest(request)),
  toggleUnit: (id: number) => dispatch(toggleUnit(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
