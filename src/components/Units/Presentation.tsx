/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row, ModalBody } from "rivet-react";
import { Permissions, EntityComparer, IUnitMembership, IApiState } from "../types";
import { Breadcrumbs, Content, PageTitle } from "../layout";
import { IState } from "./store";
import { Modal } from "../layout/Modal";
import AddUnitForm from "./AddUnitForm";

const Presentation: React.SFC<IProps> = ({ units: { data: units, permissions }, memberships }) => (
  <>
    <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, "Units"]} />
    <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
      {Permissions.canPost(permissions) && (
        <Modal
          title="Add new unit"
          id="+ add new unit"
          buttonText="+ Add new unit"
          buttonStyle={{ float: "right" }}
        >
          <ModalBody>
            <AddUnitForm />
          </ModalBody>
        </Modal>
      )}
      <Row>
        <Col>
          <PageTitle>Units</PageTitle>
          <p>
            IT Units are organizations of people doing IT work. Some IT Units
            are primarily responsible for departmental IT support, while others
            are principally engaged in IT service development and delivery.
          </p>
          <p>
            Use the search bar to find people or units doing IT work at IU.
          </p>
        </Col>
      </Row>
    </Content>

    <Content className="rvt-bg-white rvt-p-tb-xxl rvt-m-tb-lg">
      {memberships && memberships.data &&
        <div className="rvt-m-bottom-lg">
          <h2 className="rvt-ts-md rvt-p-bottom-md">My Units</h2>
          {memberships.data.map(m => (
            <Row>
              <Col className="rvt-p-bottom-lg">
                <a href={`/units/${m.unitId}`} className="rvt-link-bold">
                  {m.unit ? m.unit.name : "Unit"}
                </a>
                {m.unit?.active == false && (<span className="rvt-inline-alert--standalone rvt-inline-alert--info rvt-m-left-xs rvt-ts-xs">Archived</span>)}
                <p className="rvt-m-top-remove">{m.unit && m.unit.description}</p>
              </Col>
            </Row>
          ))}
        </div>
      }

      <h2 className="rvt-ts-md rvt-p-bottom-md">Active Units</h2>
      <Row style={{ justifyContent: "space-between" }}>
        {units && units
          .filter(u => u.active == true)
          .sort(EntityComparer)
          .map((r, i) => (
            <Col key={"unit:" + i} md={5} className="rvt-p-bottom-lg">
              <a href={`/units/${r.id}`} className="rvt-link-bold">
                {r.name}
              </a>
              {r.active == false && (<span className="rvt-inline-alert--standalone rvt-inline-alert--info rvt-m-left-xs rvt-ts-xs">Archived</span>)}
              <p className="rvt-m-top-remove">{r.description}</p>
            </Col>
          ))}
      </Row>

      {units && units.filter(u => u.active == false).length > 0 &&
        <>
          <h2 className="rvt-ts-md rvt-p-bottom-md">Archived Units</h2>
          <Row style={{ justifyContent: "space-between" }}>
            {units && units
              .filter(u => u.active == false)
              .sort(EntityComparer)
              .map((r, i) => (
                <Col key={"unit:" + i} md={5} className="rvt-p-bottom-lg">
                  <a href={`/units/${r.id}`} className="rvt-link-bold">
                    {r.name}
                  </a>
                  {r.active == false && (<span className="rvt-inline-alert--standalone rvt-inline-alert--info rvt-m-left-xs rvt-ts-xs">Archived</span>)}
                  <p className="rvt-m-top-remove">{r.description}</p>
                </Col>
              ))}
          </Row>
        </>
      }
    </Content>
  </>
);

interface IProps {
  units: IState,
  memberships: IApiState<any, IUnitMembership[]>
}

export default Presentation;
