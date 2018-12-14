/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../types";
import Profile from "./Presentation";
import {
  fetchRequest,
  IState,
  IUserRequest,
  updateRequest,
  toggleUnit
} from "./store";
import { Loader } from "../Loader";
// import { Content } from "../layout/Content";

interface IProfileProps {
  match: any;
  path: string;
}
interface IPropsFromDispatch {
  profileFetchRequest: typeof fetchRequest;
  profileUpdateRequest: typeof updateRequest;
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
  }

  public render() {
    return (
      <Loader {...this.props}>
        {this.props.data && <Profile {...this.props.data} toggleUnit={this.props.toggleUnit} />}
      </Loader>
    );
  }
}

const mapStateToProps = (state: IApplicationState) => state.profile;

const mapDispatchToProps = (dispatch: Dispatch): IPropsFromDispatch => ({
  profileFetchRequest: (request: IUserRequest) =>
    dispatch(fetchRequest(request)),
  profileUpdateRequest: (request: IUserRequest) =>
    dispatch(updateRequest(request)),
  toggleUnit: (id: number) => dispatch(toggleUnit(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
