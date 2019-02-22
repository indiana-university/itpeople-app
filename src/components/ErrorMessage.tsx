/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { isString } from "util";

export const ErrorMessage = ({ error, children }: IProps) => (
  <>
    <div>{children}</div>
    {error && error instanceof Error ? (
      <section>
        {error.name && <h1 className="rvt-text-bold">{error.name}</h1>}
        <div>{error.message}</div>
        <code className="rvt-sr-only">{error.stack}</code>
      </section>
    ) : isString(error) ? (
      <p>{error}</p>
    ) : (
      <code>{JSON.stringify(error)}</code>
    )}
  </>
);

interface IProps {
  children?: React.ReactNode;
  error: Error | string;
}
