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
  error?: object | string;
}

const Component: React.SFC<IProps> = ({ submitSearch, error }) => (
  <>
    <div className="rvt-p-top-xl rvt-p-bottom-xl">
      <Content>
        <Row>
          <Col lg={8}>
            <div className="rvt-display-none">
              <PageTitle>404: Not Found</PageTitle>
            </div>
            <h2 className="rvt-ts-46">Well, this is embarassing.</h2>
            <p>
              This page was not found. Try searching below, or if this page
              should exist, please let someone know{" "}
              <a href="mailto:someone@iu.edu">here</a>.
            </p>
            {error && (
              <div className="rvt-m-top-lg rvt-display-none">
                <pre className="rvt-ts-12">{error}</pre>
              </div>
            )}
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

Component.displayName = "Error";

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    submitSearch: () => dispatch(Search.submit())
  };
}
export default connect(
  () => ({}),
  mapDispatchToProps
)(Component);
