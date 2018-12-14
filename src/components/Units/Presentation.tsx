import * as React from "react";
import { Col, Row } from "rivet-react";
import { IEntity } from "../types";
import { Breadcrumbs, Content, PageTitle } from "../layout";

interface IProps {
  units: IEntity[];
}

const Presentation: React.SFC<IProps> = ({ units }) => (
  <>
    <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, "Units"]} />
    <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
      <Row>
        <Col>
          <PageTitle>Units</PageTitle>
          <p>
            IT Units are organizations of people doing IT work. Some IT Units 
            are primarily responsible for departmental IT support, while others 
            are principally engaged in IT service development and delivery.  
          </p>
        </Col>
      </Row>
    </Content>

    <Content className="rvt-bg-white rvt-p-tb-xxl rvt-m-tb-lg">
      <Row style={{ justifyContent: "space-between" }}>
        {units.map((r, i) => (
          <Col key={"unit:" + i} md={5} className="rvt-p-bottom-lg">
            <a href={`/units/${r.id}`} className="rvt-link-bold">
              {r.name}
            </a>
            <p className="rvt-m-top-remove">{r.description}</p>
          </Col>
        ))}
      </Row>
    </Content>
  </>
);

export default Presentation;
