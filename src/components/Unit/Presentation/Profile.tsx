/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Section } from "rivet-react";
import PageTitle from "../../layout/PageTitle";
// import { Pencil } from "src/components/icons";
import { IUnit } from "../../types";
import { IDefaultState } from "../../types";
import { Loader } from "../../Loader";

const Profile: React.SFC<IDefaultState<IUnit>> = props => {
  const { data: profile } = props;

  return (
    <Loader {...props}>
      {profile && (
        <>
          <PageTitle>{profile.name}</PageTitle>
          <Section>
            {profile.description && (
              <div className="group-describer rvt-m-bottom-md">
                <span>{profile.description}</span>
              </div>
            )}
            {profile.url && (
              <a
                href={profile.url}
                className="rvt-button rvt-button--secondary"
              >
                Unit Website
              </a>
            )}
          </Section>
        </>
      )}
    </Loader>
  );
};

export default Profile;
