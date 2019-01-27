/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row, Section, Button } from "rivet-react";
import { IUnitProfile } from "../index";
import { Panel } from "../../Panel";
import PageTitle from "../../layout/PageTitle";
import { Breadcrumbs, Content } from "../../layout";
import * as unit from "../store";
import UpdateUnitForm from "../Forms/UpdateUnitForm";
import UpdateMembersForm from "../Forms/UpdateMembersForm";
import UpdateParentForm from "../Forms/UpdateParentForm";
import UpdateChildrenForm from "../Forms/UpdateChildrenForm";
import UpdateDepartmentsForm from "../Forms/UpdateDepartmentsForm";

interface IAuthenticatedUsername {
  authenticatedUsername: string;
}
interface IProps {
  cancel: typeof unit.cancel;
}

export const Edit: React.SFC<
  IUnitProfile & IAuthenticatedUsername & IProps
> = props => (
  <>
    <Breadcrumbs
      crumbs={[
        { text: "Home", href: "/" },
        { text: "Units", href: "/units" },
        props.name
      ]}
    />

    <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
      <Button
        onClick={props.cancel}
        type="button"
        style={{ float: "right" }}
        variant="plain"
      >
        Cancel
      </Button>
      <PageTitle>Edit</PageTitle>
      <Section>
        <UpdateUnitForm />
      </Section>
    </Content>

    <Content className="rvt-bg-white rvt-p-tb-xxl">
      <Row>
        <Col lg={6}>
          <Section>
            <UpdateMembersForm initialValues={props} />
          </Section>
        </Col>
        <Col lg={5} last={true}>
          <div className="rvt-m-all-md">
            {(props.parent ||
              (props.children && props.children.length > 0)) && (
              <div className="rvt-m-bottom-lg">
                <Panel title="Parent and Children">
                  <UpdateParentForm initialValues={props} {...props} />
                  <UpdateChildrenForm initialValues={props} {...props} />
                </Panel>
              </div>
            )}
                <Panel title="Supported Departments">
                  <UpdateDepartmentsForm initialValues={props} {...props} />
                </Panel>
          </div>
        </Col>
      </Row>
    </Content>
  </>
);
