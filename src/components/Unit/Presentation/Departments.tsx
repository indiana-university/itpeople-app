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
              .map((supportRelationship, i) => (
                <li key={i}>
                  <a href={`/departments/${supportRelationship.department.id}`}>{supportRelationship.department.name}</a> 
                  {supportRelationship.supportType && (
                    <div>
                      <span style={{ fontSize: "smaller" }}>({supportRelationship.supportType?.name})</span>
                    </div>
                  )}
                  {supportRelationship.department.description && (
                    <div>
                      <span style={{ fontSize: "smaller" }}>{supportRelationship.department.description}</span>
                    </div>
                  )}
                </li>
            ))}
          </List>
        )}
      </Loader>
    </>
  );
};

export default Departments;
