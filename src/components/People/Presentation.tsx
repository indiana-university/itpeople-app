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
            Use the filters below to find IT People based on their role within a unit, their job classification, and/or campus.
          </p>
        </Col>
      </Row>

      <Row>
        <Col margin={{top:"md"}}>
          <FilterPeopleForm />
        </Col>
      </Row>
    </Content>

    { people && people.length == 0 &&
      <Content className="rvt-bg-white rvt-p-tb-xxl rvt-m-tb-lg">
        <p>No people found matching those filters.</p>
      </Content>
    }

    { people && people.length > 0 && people[0].name !== "default" && 
      <Content className="rvt-bg-white rvt-p-tb-xxl rvt-m-tb-lg">
      <Row style={{ justifyContent: "space-between" }}>
        {people
          .sort(EntityComparer)
          .map((r, i) => (
            <Col key={"unit:" + i} md={5} className="rvt-p-bottom-lg">
              <a href={`/units/${r.id}`} className="rvt-link-bold">
                {r.name}
              </a> ({r.netId}; {r.department && r.department.name})
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
