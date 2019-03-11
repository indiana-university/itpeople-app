/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row, Button } from "rivet-react";
import { Panel } from "../../Panel";
import { Breadcrumbs, Content } from "../../layout";
import { IState, deleteUnit } from "../store";
import Profile from "./Profile";
import Members from "./Members";
import Parent from "./Parent";
import Children from "./Children";
import { IEntity, IDefaultState, Permissions, IApiState } from "../../types";
import Departments from "./Departments";
import { Pencil, TrashCan } from "src/components/icons";

interface IProps {
  edit(): any;
  deleteUnit: typeof deleteUnit;
  unitChildren: IDefaultState<IEntity[]>;
}
const hasData = (result: IApiState<any, any>) => {
  return result.loading || result.error || (Array.isArray(result.data) ? !!result.data.length : !!result.data);
};

const Presentation: React.SFC<IState & IProps> = props => {
  const { edit, deleteUnit, profile, members, parent, unitChildren, departments } = props;
  const name = profile.data ? profile.data.name : "...";
  const handleDelete = () => {
    if (profile && profile.data && confirm(`Are you sure you want to delete ${profile.data.name}? This can't be undone.`)) {
      deleteUnit(profile.data);
    }
  }
  return (
    <>
      <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, { text: "Units", href: "/units" }, name]} />
      <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
        <div style={{ display: "flex", justifyContent: "space-between", float: "right" }}>
          {profile && Permissions.canDelete(profile.permissions) && (
            <Button onClick={handleDelete} className="rvt-m-right-xs" title={`Delete: ${name}`} variant="danger">
              <TrashCan />
            </Button>
          )}
          {profile && Permissions.canPut(profile.permissions) && (
            <Button onClick={edit} title={`Edit: ${name}`}>
              <Pencil />
            </Button>
          )}
        </div>
        <Profile {...profile} />
      </Content>
      <Content className="rvt-bg-white rvt-p-tb-xxl">
        <Row>
          <Col lg={6}>
            <Members {...members} />
          </Col>
          <Col lg={5} last={true}>
            <div className="rvt-m-all-md">
              {(hasData(parent) || hasData(unitChildren)) && (
                <div className="rvt-m-bottom-lg">
                  <Panel title="Parent and Children">
                    <Parent {...parent} />
                    <Children {...unitChildren} />
                  </Panel>
                </div>
              )}
              {hasData(departments) && (
                <Panel title="Supported Departments">
                  <Departments {...departments} />
                </Panel>
              )}
            </div>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Presentation;
