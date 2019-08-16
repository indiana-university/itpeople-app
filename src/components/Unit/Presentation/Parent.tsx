/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState, IUnit } from "src/components/types";
import { Loader } from "src/components/Loader";
import { ParentCard } from ".";

const Parent: React.SFC<IDefaultState<IUnit>> = props => {
  const { data: parent } = props;
  return (
    <div>
      <Loader {...props}>{parent && <ParentCard parent={parent} />}</Loader>
    </div>
  );
};

export default Parent;
