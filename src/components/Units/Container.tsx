/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, IUnitMembership, IAuthUser, IApiState } from "../types";
import Units from "./Presentation";
import { fetchUnits, IState } from "./store";
import { Loader } from "../Loader";
import { fetchMembershipsRequest } from "../Profile/store";

// We can use `typeof` here to map our dispatch types to the props, like so.

// tslint:disable-next-line:max-classes-per-file
class Container extends React.Component<IProps> {
  public componentDidMount() {
    const { fetchRequest, fetchMembershipsRequest, user } = this.props;
    fetchRequest();
    fetchMembershipsRequest({ id: user.user_name });
  }

  public render() {
    const { units, memberships } = this.props;
    return (
        <Loader {...units}>
          {units.data && <Units units={units} memberships={memberships} />}
        </Loader>
    );
  }
}
interface IDispatchProps {
  fetchRequest: typeof fetchUnits;
  fetchMembershipsRequest: typeof fetchMembershipsRequest
}
interface IProps extends IDispatchProps {
  units: IState,
  memberships: IApiState<any, IUnitMembership[]>,
  user: IAuthUser
}

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  units: state.units,
  memberships: state.profile.memberships,
  user: state.auth.data
});

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  fetchRequest: () => dispatch(fetchUnits()),
  fetchMembershipsRequest: (req) => {
    return dispatch(fetchMembershipsRequest(req))
  }
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
