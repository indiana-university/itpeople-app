/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState, BuildingSupportRelationshipComparer, IBuildingSupportRelationship } from "src/components/types";
import { Loader } from "src/components/Loader";
import { List } from "rivet-react";

const Buildings: React.SFC<IDefaultState<IBuildingSupportRelationship[]>> = props => {
  const { data: departments } = props;
  return (
    <>
      <Loader {...props}>
        {departments && (
          <List variant="plain">
            {departments
              .sort(BuildingSupportRelationshipComparer)
              .map(({ building }, i) => (
                <li key={i}>
                  {building.name}<br /> {building.address}{building.address && ","} {building.city} {building.state} {building.postCode}
                </li>
            ))}
          </List>
        )}
      </Loader>
    </>
  );
};

export default Buildings;
