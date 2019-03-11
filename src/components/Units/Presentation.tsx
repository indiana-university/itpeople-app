/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row, ModalBody, Button } from "rivet-react";
import { Permissions, IUnit } from "../types";
import { Breadcrumbs, Content, PageTitle } from "../layout";
import { IState } from "./store";
import { Modal, closeModal } from "../layout/Modal";
import AddUnitForm from "./AddUnitForm";
import { TrashCan } from "../icons";

interface IProps {
  state: IState;
  closeModal: typeof closeModal;
  deleteUnit: (unit: IUnit) => any
}

// TODO: Add new unit form - modal?
// TODO: check permissions
// TODO: show "Add" button
// TODO: Add modal
// TODO: Dispatch to add unit

const Presentation: React.SFC<IProps> = ({ state, closeModal, deleteUnit }) => (
  <>
    <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, "Units"]} />

    <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
      {state && Permissions.canPost(state.permissions) && (
        <Modal
          title="Add new unit"
          id="+ add new unit"
          buttonText="+ Add new unit"
          buttonStyle={{ float: "right" }}
        >
          <ModalBody>
            <AddUnitForm
             
            />
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
      <Row style={{ justifyContent: "space-between" }}>
        {state.data && state.data.map((r, i) => (
          <Col key={"unit:" + i} md={5} className="rvt-p-bottom-lg">
            <a href={`/units/${r.id}`} className="rvt-link-bold">
              {r.name}
            </a>
            <p className="rvt-m-top-remove">{r.description}</p>
            {Permissions.canDelete(state.permissions) &&
              <Button onClick={() => deleteUnit(r)}> <TrashCan /> </Button>
            }
          </Col>
        ))}
      </Row>
    </Content>
  </>
);

export default Presentation;
