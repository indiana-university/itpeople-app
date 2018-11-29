import * as React from "react";
import { Section } from "rivet-react";
import { ProfileListItem } from "./ProfileListItem";
import { IEntity } from "../types";

export const ProfileList: React.SFC<IProps> = ({ users, title }) => {
  return (<>
    <Section className="rvt-m-bottom-lg list-stripes">
      {title &&
        <h3 className="rvt-ts-20 rvt-ts-26-lg-up rvt-m-bottom-xs">{title}</h3>
      }
      {users &&
        users.map((m, i) => (<ProfileListItem key="i" {...m} />))
      }
    </Section>
  </>)
}

interface IProps {
  users: IEntity[],
  title?: string
}