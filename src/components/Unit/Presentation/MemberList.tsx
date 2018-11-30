import * as React from "react";
import { MemberListItem } from "./MemberListItem";
import { IUnitMember } from "../store";
import { Section } from "rivet-react";

export const MemberList: React.SFC<IProps> = ({
  members,
  title,
  showImages
}) => {
  return (
    <Section className="rvt-m-bottom-lg">
      {title && (
        <h3 className="rvt-ts-20 rvt-ts-26-lg-up rvt-m-bottom-xs rvt-text-bold">
          {title}
        </h3>
      )}
      <div className="list-stripes">
        {members &&
          members.map((m, i) => (
            <MemberListItem key={i} {...m} showImage={showImages} />
          ))}
      </div>
    </Section>
  );
};
interface IProps {
  members: IUnitMember[];
  title?: string;
  showImages?: boolean;
}
