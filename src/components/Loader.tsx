/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { ErrorMessage } from "./ErrorMessage";

export const Loader = ({ loading, loadingMessage, data, error, children }: IProps) => (
  <>
    {loading && (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span className="rvt-loader rvt-loader--md rvt-m-all-sm" aria-label="Content loading" /> {" "}
        {loadingMessage && <span>{loadingMessage}</span>}
      </div>
    )}
    {!loading && data && children && <>{children}</>}
    {!loading && error && <ErrorMessage error={error} />}
  </>
);

interface IProps {
  children?: React.ReactNode;
  loading: boolean;
  loadingMessage?: string | React.ReactNode;
  data?: any;
  error?: string | Error;
}
