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
    <div className="rvt-p-top-xl rvt-p-bottom-xl rvt-bg-white">
      <Content>
        <Row>
          <Col lg={8}>
            <div className="rvt-display-none">
              <PageTitle>404: Not Found</PageTitle>
            </div>
            <h2 className="rvt-ts-46">Uh-oh, this is a 404.</h2>
            <p>
              This page can’t be found. The link may be broken or this page may
              have been moved. Try clicking on the  IT People button at the top
              of the page, but if this happens again, please let someone know at
              {' '}<a href="mailto:dcdreq@iu.edu">dcdreq@iu.edu</a>.
            </p>
            {error && (
              <div className="rvt-m-top-lg rvt-display-none">
                <pre className="rvt-ts-12">{error}</pre>
              </div>
            )}
          </Col>
        </Row>
      </Content>
      <Content>
        <Row>
          <Col className="rvt-m-top-lg">
            <SearchForm onSubmit={submitSearch} />
          </Col>
        </Row>
      </Content>
    </div>
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
