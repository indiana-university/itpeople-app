/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IUnitMember } from "../store";
import { Row, Col } from "rivet-react";

export const MemberListItem: React.SFC<IUnitMember & IProps> = ({
  person,
  personId,
  title,
  showImage
}) => {
  return (
    <div>
      <Row>
        {showImage && person && person.photoUrl && (
          <Col sm={2}>
            <img
              src={person.photoUrl}
              width={"100%"}
              style={{
                borderRadius: "100%",
                overflow: "hidden",
                objectFit: "cover"
              }}
            />
          </Col>
        )}
        <Col style={{ alignSelf: "center" }}>
          <a
            href={"/people/" + personId}
            data-modal-trigger="modal-edit-person"
            className="rvt-m-bottom-remove person-list-item-new-name rvt-text-bold rvt-m-bottom-sm rvt-ts-18"
          > 
            <span className="viewIcons delFaceName _delete fl">{person && person.name}</span>
          </a>
          {title && (
            <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">
              {title}
            </p>
          )}
        </Col>
      </Row>
    </div>
  );
};

interface IProps {
  showImage?: boolean;
}
