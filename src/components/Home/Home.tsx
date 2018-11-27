
import * as React from 'react';
import { Dispatch } from 'redux'
import { connect } from 'react-redux';
import { Col, Row } from 'rivet-react'
import PageTitle from '../layout/PageTitle';
import { Content } from '../layout/Content';
import SearchForm from '../layout/SearchForm';
import * as Search from "../Search/store";

interface IProps {
  submitSearch: typeof Search.submit
}

const Component: React.SFC<IProps> = ({ submitSearch }) => (
  <>
    <div className="rvt-bg-cream rvt-p-top-xl rvt-p-bottom-xl rvt-m-top-xxl rvt-m-bottom-xxl">
      <Content>
        <Row>
          <Col lg={8} style={{ color: "#333" }}>
            <PageTitle>IT People</PageTitle>
            <p>
              Description of what IT People is and how to use it...Lorem ipsum
              dolor sit amet, usu an elit euismod pertinax, iudico ignota possit
              mei ei. Ius ad dicta praesent, malis liber nec ei. Adhuc novum
              ceteros sed ea, omnes possit graecis at eam. In pri aeterno
              delectus. Porro facer ad eum, vel vivendum lobortis praesent ei,
              mea at prompta numquam consulatu.
            </p>
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

Component.displayName = 'Home';

function mapDispatchToProps(dispatch: Dispatch){
  return {
    submitSearch: () => dispatch(Search.submit())
  }
}
export default connect(
  () => ({}),
  mapDispatchToProps)(Component);
