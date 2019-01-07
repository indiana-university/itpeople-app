/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Row, Col } from "rivet-react";
import { MemberList } from "./MemberList";
import { IUnitMember, UitsRole } from "..";

export const MemberLists: React.SFC<IProps> = ({ members, title }) => {
  const leaders: IUnitMember[] = [];
  const related: IUnitMember[] = [];
  const team: IUnitMember[] = [];
  members && members.forEach(m => {
    switch (m.role) {
      case UitsRole.Leader:
        leaders.push(m);
        break;
      case UitsRole.Related:
        related.push(m);
        break;
      default:
        team.push(m);
        break;
    }
  })


  return <>
      {title && <h2 className="rvt-ts-32">{title}</h2>}
      <Row>
        <Col>
          {leaders.length > 0 && <MemberList title={"Leadership (" + leaders.length + ")"} members={leaders} showImages={true} />}
          {related.length > 0 && <MemberList title={"Related (" + related.length + ")"} members={related} />}
          {team.length > 0 && <MemberList title={"Members (" + team.length + ")"} members={team} />}
        </Col>
      </Row>
    </>;
}

interface IProps {
  members: IUnitMember[],
  title?: string
}