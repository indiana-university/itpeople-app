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
            Description of what IT People is and how to use it...Lorem ipsum
            dolor sit amet, usu an elit euismod pertinax, iudico ignota possit
            mei ei. Ius ad dicta praesent, malis liber nec ei. Adhuc novum
            ceteros sed ea, omnes possit graecis at eam. In pri aeterno
            delectus. Porro facer ad eum, vel vivendum lobortis praesent ei, mea
            at prompta numquam consulatu.
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
