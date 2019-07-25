/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row } from "rivet-react";
import { EntityComparer } from "../types";
import { Breadcrumbs, Content, PageTitle } from "../layout";
import { IState } from "./store";
import FilterPeopleForm from "./FilterPeopleForm";

const Presentation: React.SFC<IProps> = ({ people: { data: people, permissions } }) => (
  <>
    <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, "Units"]} />
    <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">

      <Row>
        <Col>
          <PageTitle>People</PageTitle>
          <p>
            Blah blah blah
          </p>
        </Col>
      </Row>

      <Row>
        <FilterPeopleForm />
      </Row>
    </Content>

    { people && people.length > 0 && 

      <Content className="rvt-bg-white rvt-p-tb-xxl rvt-m-tb-lg">
      <h2 className="rvt-ts-md rvt-p-bottom-md">People</h2>
      <Row style={{ justifyContent: "space-between" }}>
        {people
          .sort(EntityComparer)
          .map((r, i) => (
            <Col key={"unit:" + i} md={5} className="rvt-p-bottom-lg">
              <a href={`/units/${r.id}`} className="rvt-link-bold">
                {r.name}
              </a>
              <p className="rvt-m-top-remove">{r.netId}</p>
            </Col>
          ))}
      </Row>
    </Content>
    }
  </>
);

interface IProps {
  people: IState,
}

export default Presentation;
