/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, ViewStateType } from "../types";
import Unit from "./Presentation";
import * as unit from "./store";
import * as auth from "../SignIn/store";
import { Loader } from "../Loader";
import EditForm from "./Presentation/EditForm";

interface IContainerProps {
  match: any;
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IDispatchProps {
  fetchRequest: typeof unit.fetchRequest;
  save: typeof unit.saveRequest;
  edit: typeof unit.edit;
  cancel: typeof unit.cancel;
}

interface ICurrentUser {
  auth: auth.IState
}

// tslint:disable-next-line:max-classes-per-file
class Container extends React.Component<
  unit.IState & ICurrentUser & IContainerProps & IDispatchProps
  > {
  public componentDidMount() {
    this.props.fetchRequest(this.props.match.params);
  }

  public render() {
    let authenticatedUsername = (this.props.auth && this.props.auth.data && this.props.auth.data.user_name) || "";
    return (
      <Loader {...this.props}>
        {this.props.data &&
          <>
            {this.props.view == ViewStateType.Editing &&
              <EditForm save={this.props.save} cancel={this.props.cancel} initialValues={this.props.data}/>
            }

            {this.props.view != ViewStateType.Editing &&
              <Unit {...this.props.data} authenticatedUsername={authenticatedUsername} edit={this.props.edit} />
            }
          </>
        }

      </Loader>)

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
  fetchRequest: (request: unit.IUnitRequest) => dispatch(unit.fetchRequest(request)),
  edit: () => dispatch(unit.edit()),
  save: () => dispatch(unit.saveRequest()),
  cancel: () => dispatch(unit.cancel())
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
