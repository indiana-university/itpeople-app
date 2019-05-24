/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, IEntityRequest } from "../types";
import { View } from "./Presentation";
import {
  fetchRequest,
  fetchMembershipsRequest,
  IState,
  toggleUnit
} from "./store";
import { change } from "redux-form";
import { closeModal } from "../layout/Modal";

interface IProfileProps {
  match: any;
  path: string;
}
interface IPropsFromDispatch {
  profileFetchRequest: typeof fetchRequest;
  fetchMembershipsRequest: typeof fetchMembershipsRequest;
  // profileUpdateRequest: typeof updateRequest;
  toggleUnit: typeof toggleUnit;
  editJobClasses: (j: string[]) => any,
  closeModal: typeof closeModal
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
  toggleUnit: (id: number) => dispatch(toggleUnit(id)),
  editJobClasses: (jobClasses: string[]) => {
    const jobClassFields = JobClassList.map((name) => ({ name, enabled: jobClasses.includes(name) }));
    dispatch(change("updateJobClasses", "jobClasses", jobClassFields));
  },
  closeModal: () => dispatch(closeModal()),
});
const JobClassList = ["None", "ItLeadership", "BizSysAnalysis", "DataAdminAnalysis", "DatabaseArchDesign", "InstructionalTech", "ItProjectMgt", "ItSecurityPrivacy", "ItUserSupport", "ItMultiDiscipline", "Networks", "SoftwareAdminAnalysis", "SoftwareDevEng", "SystemDevEng", "UserExperience", "WebAdminDevEng"]

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
