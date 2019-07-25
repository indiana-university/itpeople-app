/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, IAuthUser } from "../types";
import People from "./Presentation";
import { fetchPeople, IState } from "./store";
import { Loader } from "../Loader";

// We can use `typeof` here to map our dispatch types to the props, like so.

// tslint:disable-next-line:max-classes-per-file
class Container extends React.Component<IProps> {
  public render() {
    const { people } = this.props;
    return (
        <Loader {...people}>
          {people.data && <People people={people} />}
        </Loader>
    );
  }
}
interface IDispatchProps {
  fetchRequest: typeof fetchPeople;
}
interface IProps extends IDispatchProps {
  people: IState,
  user: IAuthUser
}

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  people: state.people,
  user: state.auth.data
});

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  fetchRequest: (req) => dispatch(fetchPeople(req))
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
