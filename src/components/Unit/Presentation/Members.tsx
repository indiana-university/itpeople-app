/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Section } from "rivet-react";
import { IUnitMember } from "../store";
import { IDefaultState } from "src/components/types";
import { Loader } from "src/components/Loader";
import { MemberLists } from "..";

const Members: React.SFC<IDefaultState<IUnitMember[]>> = props => {
  const { data: members } = props;
  return (
    <>
      <Loader {...props}>
        {members && (
          <Section>
            <MemberLists members={members} />
          </Section>
        )}
      </Loader>
    </>
  );
};

export default Members;
