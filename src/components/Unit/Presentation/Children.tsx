/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState, IEntity } from "src/components/types";
import { Loader } from "src/components/Loader";
import { ChildrenCard } from "..";

const Children: React.SFC<IDefaultState<IEntity[]>> = props => {
  const { data: units } = props;
  return (
    <>
      <Loader {...props}>{units && <ChildrenCard children={units} />}</Loader>
    </>
  );
};

export default Children;
