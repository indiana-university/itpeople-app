/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Col, Row } from "rivet-react";
import PageTitle from "../layout/PageTitle";
import { Content } from "../layout/Content";
import SearchForm from "../layout/SearchForm";
import * as Search from "../Search/store";
import * as Auth from "../SignIn/store";
import { IApplicationState } from "../types";

const Component: React.SFC<IDispatchProps & IStateProps> = ({
  signInRequest,
  submitSearch,
  user
}) => (
  <>
    <Content className="rvt-p-top-xl rvt-bg-white rvt-p-bottom-xl rvt-m-top-xxl rvt-m-bottom-xxl">
      <Row>
        <Col lg={8} style={{ color: "#333" }}>
          <PageTitle>IT People</PageTitle>
          <p>
            IT People is a directory of people doing or supporting information 
            technology (IT) work at Indiana University. You can search for units 
            and people by name, or browse all <a href="/units">units</a> and 
            their membership.
          </p>
        </Col>
      </Row>

      {user ? (
        <Row>
          <Col className="rvt-m-top-lg">
            <SearchForm onSubmit={submitSearch} />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col className="rvt-m-top-lg">
            <button className="rvt-button" onClick={signInRequest}>
              Login
            </button>
          </Col>
        </Row>
      )}
    </Content>
  </>
);

Component.displayName = "Home";

interface IDispatchProps {
  signInRequest: typeof Auth.signInRequest;
  submitSearch: typeof Search.submit;
}
interface IStateProps {
  user?: object;
}

const mapStateToProps = ({ auth }: IApplicationState) => ({
  user: auth.data
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  signInRequest: () => dispatch(Auth.signInRequest()),
  submitSearch: () => dispatch(Search.submit())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
