/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, List, Row, Section } from "rivet-react";
import { ChildrenCard, IUnitProfile, MemberLists, ParentCard } from "../index";
import { Panel } from "../../Panel";
import PageTitle from "../../layout/PageTitle";
import { Breadcrumbs, Content } from "../../layout";
// import { Link } from "react-router-dom";
function canEdit(currentUsername:string){
  return true;
}

interface IAuthenticatedUsername {
  authenticatedUsername: string;
}

const Presentation: React.SFC<
  IUnitProfile & IAuthenticatedUsername
> = props => (
  <>
    <Breadcrumbs
      crumbs={[
        { text: "Home", href: "/" },
        { text: "Units", href: "/units" },
        props.name
      ]}
    />

    <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl" >
      {canEdit(props.authenticatedUsername) && (
        <div style={{"position":"relative"}}>
          <a href={`/units/${props.id}/edit`}  style={{position:"absolute", top:"10", right:"10px"}} >{props.authenticatedUsername} can edit </a>
        </div>
      )}
      <PageTitle>{props.name}</PageTitle>

      <Section>
        {props.description && (
          <div className="group-describer rvt-m-bottom-md">
            <span>{props.description}</span>
          </div>
        )}
        {props.url && (
          <a href={props.url} className="rvt-button rvt-button--secondary">
            Unit Website
          </a>
        )}
      </Section>
    </Content>

    <Content className="rvt-bg-white rvt-p-tb-xxl">
      <Row>
        <Col lg={6}>
          <Section>
            <MemberLists {...props} />
          </Section>
        </Col>
        <Col lg={5} last={true}>
          <div className="rvt-m-all-md">
            {(props.parent ||
              (props.children && props.children.length > 0)) && (
              <div className="rvt-m-bottom-lg">
                <Panel title="Parent and Children">
                  <ParentCard parent={props.parent} />
                  <ChildrenCard children={props.children} />
                </Panel>
              </div>
            )}
            {props.supportedDepartments.length > 0 && (
              <Panel title="Supported Departments">
                <List variant="plain">
                  {props.supportedDepartments.map((r, i) => (
                    <li key={i}>
                      <a href={`/departments/${r.id}`}>{r.name}</a> <br />{" "}
                      {r.description}
                    </li>
                  ))}
                </List>
              </Panel>
            )}
          </div>
        </Col>
      </Row>
    </Content>
  </>
);

export default Presentation;
