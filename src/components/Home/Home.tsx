
import * as React from 'react';
import { Col, Row } from 'rivet-react'
import PageTitle from '../layout/PageTitle';
import { Content } from '../layout/Content';

const Component: React.SFC = () => (
  <div className="rvt-bg-gray rvt-p-top-xl rvt-p-bottom-xl">
    <Content>
      <Row>
        <Col>
          <PageTitle>IT People</PageTitle>
          <p>
          Description of what IT People is and how to use it...Lorem ipsum dolor sit amet, 
          usu an elit euismod pertinax, iudico ignota possit mei ei. Ius ad dicta praesent,
          malis liber nec ei. Adhuc novum ceteros sed ea, omnes possit graecis at eam. 
          In pri aeterno delectus. Porro facer ad eum, vel vivendum lobortis praesent ei, 
          mea at prompta numquam consulatu.
          </p>
        </Col>
      </Row>
    </Content>
  </div>
);

Component.displayName = 'Home';

export default Component;
