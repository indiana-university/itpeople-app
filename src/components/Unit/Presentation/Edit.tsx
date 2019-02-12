/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row, Section, Button } from "rivet-react";
import { Panel } from "../../Panel";
import PageTitle from "../../layout/PageTitle";
import { Breadcrumbs, Content } from "../../layout";
import * as unit from "../store";
import UpdateUnitForm from "../Forms/UpdateUnitForm";
import UpdateMembersForm from "../Forms/UpdateMembersForm";
import UpdateParentForm from "../Forms/UpdateParentForm";
import UpdateChildrenForm from "../Forms/UpdateChildrenForm";
import UpdateDepartmentsForm from "../Forms/UpdateDepartmentsForm";
import { Loader } from "../../Loader";

interface IProps extends unit.IState {
  cancel: typeof unit.cancel;
  id: number;
}

export const Edit: React.SFC<IProps> = ({ profile, members, parent, unitChildren, departments, cancel, id }) => {
  const pageName = profile && profile.data ? profile.data.name : "...";
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
                  <Loader {...profile}>
                    <UpdateParentForm initialValues={parent.data} unit={profile.data} unitId={id} parent={parent.data} />
                  </Loader>
                  <Loader {...unitChildren}>
                    <UpdateChildrenForm initialValues={unitChildren.data} unitId={id} units={unitChildren.data} />
                  </Loader>
                </Panel>
              </div>
              <Panel title="Supported Departments">
                <Loader {...departments}>
                  <UpdateDepartmentsForm unitId={id} initialValues={{ ...departments.data, unitId: id }} departments={departments.data} />
                </Loader>
              </Panel>
            </div>
          </Col>
        </Row>
      </Content>
    </>
  );
};
