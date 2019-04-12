/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as queryString from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState, IAuthRequest } from "../types";
import { postSignInRequest, IState } from "./store";
import { Content } from "../layout";
import { Loader } from "../Loader";

interface ILocationProps {
  search: string;
}
interface IComponentProps {
  location: ILocationProps;
}
interface IDispatchProps {
  postSignInRequest: typeof postSignInRequest;
}

class Component extends React.Component<IState & IComponentProps & IDispatchProps> {
  public componentDidMount() {
    const queryCode = queryString.parse(this.props.location.search).code;
    const code = (queryCode instanceof Array ? queryCode.join("") : queryCode) || "";
    this.props.postSignInRequest({ code });
  }

  public render() {
    return (
      <Content>
        <div data-testid="signin-page" className="rvt-p-all-md" style={{ background: "#ffffff" }}>
          <Loader {...this.props} loadingMessage="Signing in..." />
        </div>
      </Content>
    );
  }
}

const mapStateToProps = (state: IApplicationState) => state.auth;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  postSignInRequest: (request: IAuthRequest) => dispatch(postSignInRequest(request))
});

export default connect<IState, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
