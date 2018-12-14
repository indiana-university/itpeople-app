/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import * as Rivet from "rivet-react";

export const Content: React.SFC<JSX.IntrinsicElements["div"]> = ({
  children,
  className,
  style
}) => (
  <div style={style} className={className}>
    <Rivet.Container style={{ maxWidth: 1440, margin: "auto" }}>
      {children}
    </Rivet.Container>
  </div>
);
