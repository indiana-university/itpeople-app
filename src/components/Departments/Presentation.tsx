/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row } from "rivet-react";
import { IEntity } from "../types";
import { Content, PageTitle } from "../layout";

interface IProps {
  departments: IEntity[];
}

const Presentation: React.SFC<IProps> = ({ departments }) => {
  return (
    <>
      <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-tb-lg">
        <Row>
          <Col>
            <PageTitle>Departments</PageTitle>
            <p>
              Description of what departments are...Lorem ipsum dolor sit amet, usu
              an elit euismod pertinax, iudico ignota possit mei ei. Ius ad
              dicta praesent, malis liber nec ei. Adhuc novum ceteros sed ea,
              omnes possit graecis at eam. In pri aeterno delectus. Porro facer
              ad eum, vel vivendum lobortis praesent ei, mea at prompta numquam
              consulatu.
            </p>
          </Col>
        </Row>
      </Content>
      
      <Content className="rvt-bg-white rvt-p-tb-xxl rvt-m-tb-lg">
        <Row style={{ justifyContent: "space-between" }}>
          {departments &&
            departments.length > 0 &&
            departments.map((r, i) => (
              <Col key={i} md={5} className="rvt-p-bottom-lg">
                <a href={`/departments/${r.id}`} className="rvt-link-bold">
                  {r.name}
                </a>
                <p className="rvt-m-top-remove">{r.description}</p>
              </Col>
            ))}
        </Row>
      </Content>
    </>
  );
};
export default Presentation;
