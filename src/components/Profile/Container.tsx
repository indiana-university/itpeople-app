/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, IEntityRequest, IPerson } from "../types";
import { View } from "./Presentation";
import { fetchRequest, IState, toggleUnit, savePerson } from "./store";
import { change } from "redux-form";
import { closeModal } from "../layout/Modal";

interface IProfileProps {
  match: any;
  path: string;
}
interface IPropsFromDispatch {
  profileFetchRequest: typeof fetchRequest;
  toggleUnit: typeof toggleUnit;
  editJobClasses: (j: string[]) => any,
  closeModal: typeof closeModal,
  save: typeof savePerson
}

class Container extends React.Component<IState & IProfileProps & IPropsFromDispatch> {
  public isMyProfile() {
    return this.props.match.params.id === undefined;
  }

  public componentDidMount() {
    const id = this.isMyProfile() ? 0 : this.props.match.params.id;
    this.props.profileFetchRequest({ id });
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
  toggleUnit: (id: number) => dispatch(toggleUnit(id)),
  editJobClasses: (jobClasses: string[]) => {
    const jobClassFields = JobClassList.map((name) => ({ name, enabled: jobClasses.includes(name) }));
    dispatch(change("updateJobClasses", "jobClasses", jobClassFields));
  },
  closeModal: () => dispatch(closeModal()),
  save: (person: IPerson) => dispatch(savePerson(person))
});

// TODO: retrieve from Database?
export const JobClassList = ["None", "ItLeadership", "BizSysAnalysis", "DataAdminAnalysis", "DatabaseArchDesign", "InstructionalTech", "ItProjectMgt", "ItSecurityPrivacy", "ItUserSupport", "ItMultiDiscipline", "Networks", "SoftwareAdminAnalysis", "SoftwareDevEng", "SystemDevEng", "UserExperience", "WebAdminDevEng"]
export const JobClassDisplayNames = {
  "None": "",
  "ItLeadership": "IT Leadership",
  "BizSysAnalysis": "Business System Analysis",
  "DataAdminAnalysis": "Data Administration and Analysis",
  "DatabaseArchDesign": "Database Architecture and Design",
  "InstructionalTech": "Instructional",
  "ItProjectMgt": "IT Project Management",
  "ItSecurityPrivacy": "IT Security and Privacy",
  "ItUserSupport": "IT User Support",
  "ItMultiDiscipline": "IT Multiple Discipline",
  "Networks": "Networks",
  "SoftwareAdminAnalysis": "SoftwareAdminAnalysis",
  "SoftwareDevEng": "Software Developer/Engineer",
  "SystemDevEng": "Systems Developer/Engineer",
  "UserExperience": "User Experience",
  "WebAdminDevEng": "Web Developer/Engineer",
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
