/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Section } from "rivet-react";
import { ProfileListItem } from "./ProfileListItem";
import { IEntity, EntityComparer } from "../types";

export const ProfileList: React.SFC<IProps> = ({ users, title }) => {
  return (
    <>
      <Section className="rvt-m-bottom-lg list-dividers">
        {title && <h3 className="rvt-ts-20 rvt-ts-26-lg-up rvt-m-bottom-xs">{title}</h3>}
        {users && users.sort(EntityComparer).map((m, i) => <ProfileListItem key={"user:" + i} {...m} />)}
      </Section>
    </>
  );
};

interface IProps {
  users: IEntity[];
  title?: string;
}
