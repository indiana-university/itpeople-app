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
import { IApplicationState } from "../types";
import { signInRequest } from "../SignIn/store";

const Component: React.SFC<IDispatchProps & IStateProps> = ({
  signInRequest,
  user
}) => (
    <Content className="rvt-p-top-xl rvt-bg-white rvt-p-bottom-xl rvt-m-top-xxl rvt-m-bottom-xxl">
      <PageTitle data-testid="home-page">IT People</PageTitle>
      { user 
        ? <Row>
            <Col lg={8} style={{ color: "#333" }}>
              <p>
                IT People is a directory of people doing or supporting information 
                technology (IT) work at Indiana University. You can search for units 
                and people by name, or browse all <a href="/units">units</a> and 
                their membership.
              </p>
            </Col>
          </Row>
        : <>
            <Row>
              <Col lg={8} style={{ color: "#333" }}>
                <p>
                  IT People is a directory of people doing or supporting information
                  technology (IT) work at Indiana University. Please log in to browse the directory. 
                </p>
              </Col>
            </Row>
            <Row>
              <Col className="rvt-m-top-lg">
                <button className="rvt-button" onClick={signInRequest}>
                  Login
                </button>
              </Col>
            </Row>
          </>
      }
    </Content>
);

Component.displayName = "Home";

interface IDispatchProps {
  signInRequest: typeof signInRequest;
}
interface IStateProps {
  user?: object;
}

const mapStateToProps = ({ auth }: IApplicationState) => ({
  user: auth.data
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  signInRequest: () => dispatch(signInRequest()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
