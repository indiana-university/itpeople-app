/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Row, Col } from "rivet-react";
import { MemberList } from "./MemberList";
import { IUnitMember, UitsRole, membersInRole } from "../../types";

export const MemberLists: React.SFC<IProps> = ({ members, title }) => {
  const leaders = membersInRole(members, UitsRole.Leader);
  const subLeads = membersInRole(members, UitsRole.Sublead);
  const team = membersInRole(members, UitsRole.Member);
  const related = membersInRole(members, UitsRole.Related);

  return <>
      {title && <h2 className="rvt-ts-32">{title}</h2>}
      <Row>
        <Col>
          {leaders.length > 0 && <MemberList title={"Leaders (" + leaders.length + ")"} members={leaders} showImages={true} />}
          {subLeads.length > 0 && <MemberList title={"Subleads (" + subLeads.length + ")"} members={subLeads} showImages={true} />}
          {team.length > 0 && <MemberList title={"Members (" + team.length + ")"} members={team} />}
          {related.length > 0 && <MemberList title={"Related People (" + related.length + ")"} members={related} />}
        </Col>
      </Row>
    </>;
}

interface IProps {
  members: IUnitMember[],
  title?: string
}