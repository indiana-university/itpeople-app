import * as React from "react";
import { MemberListItem } from "./MemberListItem";
import { Section } from "rivet-react";
import { IEntity } from "../types";

export const MemberList: React.SFC<IProps> = ({ members, title }) => {
  return (
    <Section className="rvt-m-bottom-lg">
      {title &&
        <h3 className="rvt-ts-20 rvt-ts-26-lg-up rvt-m-bottom-xs rvt-text-bold" >{title}</h3>
      }
      {members &&
          members.map((m, i) =>  (<MemberListItem key={i} {...m} dark={!!((i+1) % 2)} /> ))
      }
    </Section>)
}
interface IProps {
  members: IEntity[],
  title?: string,
  showImages?: boolean
}