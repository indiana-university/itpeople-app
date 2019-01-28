/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row } from "rivet-react";
import { Panel } from "../../Panel";
import { Breadcrumbs, Content } from "../../layout";
// import { Pencil } from "src/components/icons";
import { IState } from "../store";
import Profile from "./Profile";
import Members from "./Members";
import Parent from "./Parent";
import Children from "./Children";
import { IEntity, IDefaultState } from "../../types";
import Departments from "./Departments";

interface IAuthenticatedUsername {
  authenticatedUsername: string;
}

interface IProps {
  edit(): any;
  unitChildren: IDefaultState<IEntity[]>;
}

const Presentation: React.SFC<
  IState & IAuthenticatedUsername & IProps
> = props => (
  <>
    <Breadcrumbs
      crumbs={[
        { text: "Home", href: "/" },
        { text: "Units", href: "/units" }
        // props.profile.data ? props.profile.data.name : "..."
      ]}
    />
    <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
      <Profile {...props.profile} />
    </Content>
    <Content className="rvt-bg-white rvt-p-tb-xxl">
      <Row>
        <Col lg={6}>
          <Members {...props.members} />
        </Col>
        <Col lg={5} last={true}>
          <div className="rvt-m-all-md">
            <div className="rvt-m-bottom-lg">
              <Panel title="Parent and Children">
                <Parent {...props.parent} />
                <Children {...props.unitChildren} />
              </Panel>
            </div>
            <Panel title="Supported Departments">
              <Departments {...props.departments} />
            </Panel>
          </div>
        </Col>
      </Row>
    </Content>
  </>
);

export default Presentation;
