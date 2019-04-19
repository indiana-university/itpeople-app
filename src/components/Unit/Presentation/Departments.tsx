/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState, SupportRelationshipComparer } from "src/components/types";
import { Loader } from "src/components/Loader";
import { List } from "rivet-react";
import { ISupportRelationship } from "../../types";

const Departments: React.SFC<IDefaultState<ISupportRelationship[]>> = props => {
  const { data: departments } = props;
  return (
    <>
      <Loader {...props}>
        {departments && (
          <List variant="plain">
            {departments
              .sort(SupportRelationshipComparer)
              .map(({ department }, i) => (
                <li key={i}>
                  <a href={`/departments/${department.id}`}>{department.name}</a> <br /> {department.description}
                </li>
            ))}
          </List>
        )}
      </Loader>
    </>
  );
};

export default Departments;
