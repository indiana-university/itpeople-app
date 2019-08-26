/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, IEntityRequest, IPerson, JobClassDisplayNames } from "../types";
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
  editJobClasses: (responsibilities: string[]) => {
    const jobClassFields = Object.keys(JobClassDisplayNames).map((name) => ({ name, enabled: responsibilities.includes(name) }));
    dispatch(change("updateResponsibilities", "responsibilities", jobClassFields));
  },
  closeModal: () => dispatch(closeModal()),
  save: (person: IPerson) => dispatch(savePerson(person))
});

// TODO: retrieve from Database?

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
