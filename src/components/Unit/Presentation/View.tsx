/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row, Button } from "rivet-react";
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
import { Pencil } from "src/components/icons";

interface IAuthenticatedUsername {
  authenticatedUsername: string;
}

interface IProps {
  edit(): any;
  unitChildren: IDefaultState<IEntity[]>;
}

const Presentation: React.SFC<IState & IAuthenticatedUsername & IProps> = props => {
  const { edit, profile, members, parent, unitChildren, departments } = props;
  const name = profile.data ? profile.data.name : "...";
  return (
    <>
      <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, { text: "Units", href: "/units" }, name]} />
      <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
        <Button onClick={edit} style={{ float: "right" }} title={`Edit: ${name}`}>
          <Pencil />
        </Button>
        <Profile {...profile} />
      </Content>
      <Content className="rvt-bg-white rvt-p-tb-xxl">
        <Row>
          <Col lg={6}>
            <Members {...members} />
          </Col>
          <Col lg={5} last={true}>
            <div className="rvt-m-all-md">
              <div className="rvt-m-bottom-lg">
                <Panel title="Parent and Children">
                  <Parent {...parent} />
                  <Children {...unitChildren} />
                </Panel>
              </div>
              <Panel title="Supported Departments">
                <Departments {...departments} />
              </Panel>
            </div>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Presentation;
