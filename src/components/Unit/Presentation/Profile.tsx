/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Section, Row } from "rivet-react";
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
          {profile.active == false && (<span className="rvt-inline-alert rvt-inline-alert--standalone rvt-inline-alert--info rvt-ts-xs">Archived</span>)}
          <Section>
            {profile.description && (
              <div className="group-describer rvt-m-top-sm">
                <span>{profile.description}</span>
              </div>
            )}
            <Row>
              {profile.url && (
                <a
                  href={profile.url}
                  className="rvt-button rvt-button--secondary rvt-m-left-xs rvt-m-top-md"
                >
                  Visit Website
              </a>
            )}   
            {profile.email && (
                <a
                    href={"mailto:" + profile.email}
                    className="rvt-button rvt-button--secondary rvt-m-left-xs rvt-m-top-md"
                >
                    Contact
                </a>
            )}
            </Row>
          </Section>
        </>
      )}
    </Loader>
  );
};

export default Profile;
