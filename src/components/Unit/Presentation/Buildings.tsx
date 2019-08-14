/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState, BuildingSupportRelationshipComparer, IBuildingSupportRelationship } from "src/components/types";
import { Loader } from "src/components/Loader";
import { List } from "rivet-react";
import { join } from "src/util"

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
                  <a href={`/buildings/${building.id}`}>{building.name}</a>
                  {(building.address || building.city) && <br />}<span style={{ fontSize: "smaller" }}>{join([building.address, building.city], ", ")}</span>
                </li>
            ))}
          </List>
        )}
      </Loader>
    </>
  );
};

export default Buildings;
