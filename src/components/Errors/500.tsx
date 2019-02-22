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

interface IProps {
  submitSearch: typeof Search.submit;
  error?: object;
}

const Component: React.SFC<IProps> = ({ submitSearch, error }) => (
  <>
    <div className="rvt-p-top-xl rvt-p-bottom-xl">
      <Content>
        <Row>
          <Col lg={8}>
            <PageTitle>404</PageTitle>

            <h2 className="rvt-ts-46">Well, this is embarassing.</h2>
            <p>
              This page did not load properly. Try clicking on the{" "}
              <a href="/">IT People</a> button at the top of the page, but if
              this happens again, please let someone know at {" "}
              <a href="mailto:dcdreq@iu.edu">dcdreq@iu.edu</a>..
            </p>
            {error && <p>{error}</p>}
          </Col>
        </Row>
      </Content>
    </div>
    <Content>
      <Row>
        <Col className="rvt-m-top-lg">
          <SearchForm onSubmit={submitSearch} />
        </Col>
      </Row>
    </Content>
  </>
);

Component.displayName = "Search";

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    submitSearch: (q:string) => dispatch(Search.submit(q))
  };
}
export default connect(
  () => ({}),
  mapDispatchToProps
)(Component);
