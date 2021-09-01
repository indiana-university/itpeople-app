/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row, Button } from "rivet-react";
import { Breadcrumbs, Content } from "../../layout";
import { IState, deleteUnit, archiveUnit } from "../store";
import Profile from "./Profile";
import Members from "./Members";
import Parent from "./Parent";
import Children from "./Children";
import { IDefaultState, Permissions, IApiState, IUnit } from "../../types";
import Departments from "./Departments";
import Buildings from "./Buildings";
import { ClosedLock, OpenLock, Pencil, TrashCan } from "src/components/icons";
import { Collapse } from 'rivet-react/addons';

interface IProps {
  edit(): any;
  deleteUnit: typeof deleteUnit;
  archiveUnit: typeof archiveUnit;
  unitChildren: IDefaultState<IUnit[]>;
}
const hasData = (result: IApiState<any, any>) => {
  return result.loading || result.error || (Array.isArray(result.data) ? !!result.data.length : !!result.data);
};

const Presentation: React.SFC<IState & IProps> = props => {
  const { edit, deleteUnit, archiveUnit, profile, members, parent, unitChildren, departments, buildings } = props;
  const name = profile.data ? profile.data.name : "...";
  let memberPermissions = members.data?.map(m => m.permissions);
  const handleDelete = () => {
    if (profile && profile.data && confirm(`Are you sure you want to delete ${profile.data.name}? This can't be undone.`)) {
      deleteUnit(profile.data);
    }
  }
  const handleArchive = () => {
    let question = `Are you sure you want to ${profile.data?.active ? "archive" : "unarchive"} ${profile?.data?.name}?`;
    let followUp = profile.data?.active
      ? " All members will lose their assigned tools, and the unit will be listed as Archived."
      : " All members' assigned tools and relationships will be reactivated."
    if (profile && profile.data && confirm(question + followUp)) {
      archiveUnit(profile.data);
    }
  }
  return (
    <>
      <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, { text: "Units", href: "/units" }, name]} />
      <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
        <div style={{ display: "flex", justifyContent: "space-between", float: "right" }}>
          {profile && profile.data && Permissions.canDelete(profile.permissions) && (
            <Button onClick={handleDelete} className="rvt-m-right-xs" title={`Delete: ${name}`} variant="danger">
              <TrashCan />
            </Button>
          )}
          {profile && profile.data && Permissions.canDelete(profile.permissions) && (
            <Button onClick={handleArchive} className="rvt-m-right-xs" title={`${profile.data.active ? 'Archive' : 'Unarchive'}: ${name}`}>
              {profile.data.active && <ClosedLock />}
              {profile.data.active == false && <OpenLock />}
            </Button>
          )}
          {profile && (Permissions.canPut(profile.permissions) || memberPermissions?.includes("ManageTools")) && (
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
            {/* <div className="rvt-m-all-md"> */}
              {(hasData(parent) || hasData(unitChildren)) && (
                <div className="rvt-m-bottom-lg">
                <Collapse title="Parent and Children" variant="panel" TitleComponent="h3" defaultClosed={false}>
                    <Parent {...parent} />
                    <Children {...unitChildren} />
                  </Collapse>
                </div>
              )}
              {hasData(departments) && (
                <div className="rvt-m-bottom-lg">
                <Collapse title="Supported Departments" variant="panel" TitleComponent="h3" defaultClosed={true}>
                    <Departments {...departments} />
                  </Collapse>
                </div>
              )}
              {hasData(buildings) && (
                <Collapse title="Supported Buildings" variant="panel" TitleComponent="h3" defaultClosed={true}>
                  <Buildings {...buildings} />
                </Collapse>
              )}
            {/* </div> */}
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Presentation;
