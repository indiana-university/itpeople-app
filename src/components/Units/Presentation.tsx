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
            Description of what IT units are...Lorem ipsum dolor sit amet, usu
            an elit euismod pertinax, iudico ignota possit mei ei. Ius ad dicta
            praesent, malis liber nec ei. Adhuc novum ceteros sed ea, omnes
            possit graecis at eam. In pri aeterno delectus. Porro facer ad eum,
            vel vivendum lobortis praesent ei, mea at prompta numquam consulatu.
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
