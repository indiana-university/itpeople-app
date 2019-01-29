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

interface IAuthenticatedUsername {
  authenticatedUsername: string;
}
interface IProps {
  cancel: typeof unit.cancel;
}

export const Edit: React.SFC<
  unit.IState & IAuthenticatedUsername & IProps
> = props => {
  const { profile, members, parent, unitChildren, departments, cancel } = props;
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { text: "Home", href: "/" },
          { text: "Units", href: "/units" },
          profile && profile.data ? profile.data.name : "..."
        ]}
      />

      <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
        <Button
          onClick={cancel}
          type="button"
          style={{ float: "right" }}
          variant="plain"
        >
          Cancel
        </Button>
        <PageTitle>Edit</PageTitle>
        <Section>
          <Loader {...profile}>
            <UpdateUnitForm
              initialValues={profile.data}
              {...props.profile.data}
            />
          </Loader>
        </Section>
      </Content>

      <Content className="rvt-bg-white rvt-p-tb-xxl">
        <Row>
          <Col lg={6}>
            <Section>
              <Loader {...members}>
                <UpdateMembersForm
                  initialValues={members.data}
                  {...members.data}
                />
              </Loader>
            </Section>
          </Col>
          <Col lg={5} last={true}>
            <div className="rvt-m-all-md">
              <div className="rvt-m-bottom-lg">
                <Panel title="Parent and Children">
                  <Loader {...parent}>
                    <UpdateParentForm
                      initialValues={parent.data}
                      {...parent.data}
                    />
                  </Loader>
                  <Loader {...unitChildren}>
                    <UpdateChildrenForm
                      initialValues={unitChildren.data}
                      {...unitChildren.data}
                    />
                  </Loader>
                </Panel>
              </div>
              <Panel title="Supported Departments">
                <Loader {...departments}>
                  <UpdateDepartmentsForm
                    initialValues={departments.data}
                    departments={departments.data}
                  />
                </Loader>
              </Panel>
            </div>
          </Col>
        </Row>
      </Content>
    </>
  );
};
