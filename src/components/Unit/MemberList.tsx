import * as React from "react";
import { MemberListItem } from "./MemberListItem";
import { IUnitMember } from "./store";
import { List, Section } from "rivet-react";

export const MemberList: React.SFC<IProps> = ({ members, title }) => {
  return (
    <Section className="rvt-m-bottom-lg">
      {title &&
        <h3 className="rvt-ts-20 rvt-ts-26-lg-up rvt-m-bottom-xs">{title}</h3>
      }
      {members &&
        <List variant="plain"> 
          {members.map((m, i) => {
              return (<li key={m.id}><MemberListItem {...m} /></li>)
            })}
        </List>
      }
    </Section>)
}
interface IProps {
  members: IUnitMember[],
  title?: string
}