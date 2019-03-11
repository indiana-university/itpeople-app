/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row, Section, Button, DismissibleAlert } from "rivet-react";
import { Panel } from "../../Panel";
import PageTitle from "../../layout/PageTitle";
import { Breadcrumbs, Content } from "../../layout";
import * as unit from "../store";
import UpdateUnitForm from "../Forms/UpdateUnitForm";
import UpdateMembersForm from "../Forms/UpdateMembersForm";
import UpdateChildrenForm from "../Forms/UpdateChildrenForm";
import UpdateDepartmentsForm from "../Forms/UpdateDepartmentsForm";
import { Loader } from "../../Loader";
import Parent from "./Parent";
import { TrashCan } from "src/components/icons";
import { Permissions } from "src/components/types";

interface IProps extends unit.IState {
  cancel: typeof unit.cancel;
  id: number;
  deleteUnit: typeof unit.deleteUnit
}

export const Edit: React.SFC<IProps> = ({ profile, members, parent, unitChildren, departments, cancel, deleteUnit, id }) => {
  const pageName = profile && profile.data ? profile.data.name : "...";
  const handleDelete = () => { 
    if(profile && profile.data && confirm("You sure?")) {
      deleteUnit(profile.data) 
    }
  };

  return (
    <>
      <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, { text: "Units", href: "/units" }, pageName, "Edit"]} />
      <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
        <Button onClick={cancel} type="button" style={{ float: "right" }} variant="plain">
          Cancel
        </Button>
        <PageTitle>Edit</PageTitle>
        <Section>
          <Loader {...profile}>
            <UpdateUnitForm initialValues={profile.data} {...profile.data} />
          </Loader>
        </Section>
      </Content>
      <Content className="rvt-bg-white rvt-p-tb-xxl">
        <Row>
          <Col lg={6}>
            <Section>
              <Loader {...members}>
                <UpdateMembersForm unitId={id} initialValues={{ members: members.data, unitId: id }} members={members.data} />
              </Loader>
            </Section>
          </Col>
          <Col lg={5} last={true}>
            <div className="rvt-m-all-md">
              <div className="rvt-m-bottom-lg">
                <Panel title="Parent and Children">
                  {(parent.loading || parent.data) && (
                    <>
                      <h2 className="rvt-text-bold">Parents</h2>
                      <p className="rvt-m-top-remove">A parent is a step higher on the org chart.</p>
                      <Parent {...parent} />
                    </>
                  )}
                  <h2 className="rvt-text-bold">Children</h2>
                  <p className="rvt-m-top-remove">
                    A child is a step lower on the org chart. If this unit has groups associated with it, add those groups here.
                  </p>
                  <Loader {...unitChildren}>
                    <UpdateChildrenForm initialValues={unitChildren.data} unitId={id} units={unitChildren.data} />
                  </Loader>
                </Panel>
              </div>
              <Panel title="Supported Departments">
                <p>Some units provide support for departments. If this unit supports other departments, add them here.</p>
                <Loader {...departments}>
                  <UpdateDepartmentsForm unitId={id} initialValues={{ ...departments.data, unitId: id }} departments={departments.data} />
                </Loader>
              </Panel>
            </div>
          </Col>
        </Row>
      </Content>
      {profile.data && Permissions.canDelete(profile.permissions) &&
        <Content className="rvt-bg-white rvt-p-tb-xxl">
          <Button variant="danger" onClick={handleDelete}> <span> Delete this unit {" "} <TrashCan /> </span></Button>
        </Content>
      }
    </>
  );
};
