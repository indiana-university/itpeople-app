import * as React from "react";
import { Row, Col, Section } from "rivet-react";
import { MemberList } from "./MemberList";
import { IUnitMember, UitsRole } from "./";

export const MemberLists: React.SFC<IProps> = ({ members, title }) => {
  const leaders: IUnitMember[] = [];
  const related: IUnitMember[] = [];
  const team: IUnitMember[] = [];
  members.forEach(m => {
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


  return (<>
    {title && <Section><h2 className="rvt-ts-26 rvt-m-top-lg">{title}</h2></Section>}
    <Row>
      <Col lg={6}>
        {!!leaders.length && <MemberList title={"Leadership (" + leaders.length + ")"} members={leaders} />}
        {!!related.length && <MemberList title={"Related (" + related.length + ")"} members={related} />}
      </Col>
      <Col lg={6}>
        {!!members.length && <MemberList title={"Members (" + team.length + ")"} members={team} />}
      </Col>
    </Row>
  </>)
}

interface IProps {
  members: IUnitMember[],
  title?: string
}