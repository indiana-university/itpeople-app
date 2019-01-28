/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState, IEntity } from "src/components/types";
import { Loader } from "src/components/Loader";
import { ParentCard } from "..";

const Parent: React.SFC<IDefaultState<IEntity>> = props => {
  const { data: parent } = props;
  return (
    <>
      <Loader {...props}>{parent && <ParentCard parent={parent} />}</Loader>
    </>
  );
};

export default Parent;
