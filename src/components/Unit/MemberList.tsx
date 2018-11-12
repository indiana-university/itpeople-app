import * as React from "react";
import { MemberListItem } from "./MemberListItem";
import { IUnitMember } from "./store";

export const MemberList: React.SFC<IProps> = ({ members, title }) => {
  return (
    <>
      {
        title &&
        <h3 className="rvt-ts-20 rvt-ts-26-lg-up rvt-m-bottom-xs">{title}</h3>
      }
      {members &&
        <ul>
          {
            members.map((m, i) => {
              return (<li key={m.id}><MemberListItem {...m} /></li>)
            })
          }
        </ul>
      }
    </>)
}
interface IProps {
  members: IUnitMember[],
  title?: string
}