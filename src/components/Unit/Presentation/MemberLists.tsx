/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Row, Col } from "rivet-react";
import { MemberList } from "./MemberList";
import { IUnitMember, UitsRole } from "../../types";

export const MemberLists: React.SFC<IProps> = ({ members, title }) => {
  // find all members with a matching role.
  const inRole = (role: UitsRole) => 
    (members || []).filter(m => m.role === role);
    
  const leaders = inRole(UitsRole.Leader);
  const subLeads = inRole(UitsRole.Sublead);
  const team = inRole(UitsRole.Member);
  const related = inRole(UitsRole.Related);

  return <>
      {title && <h2 className="rvt-ts-32">{title}</h2>}
      <Row>
        <Col>
          {leaders.length > 0 && <MemberList title={"Leadership (" + leaders.length + ")"} members={leaders} showImages={true} />}
          {related.length > 0 && <MemberList title={"Related (" + related.length + ")"} members={related} />}
          {subLeads.length > 0 && <MemberList title={"Subleadership (" + subLeads.length + ")"} members={subLeads} showImages={true} />}
          {team.length > 0 && <MemberList title={"Members (" + team.length + ")"} members={team} />}
        </Col>
      </Row>
    </>;
}

interface IProps {
  members: IUnitMember[],
  title?: string
}