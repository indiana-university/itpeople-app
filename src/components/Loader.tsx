/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState } from "./types";
import NotFound from "./Errors/404";

export const Loader = ({ loading, loadingMessage, data, error, children }: IDefaultState<any> & IProps) => (
  <>
    {loading && (
      <>
        <span className="rvt-loader rvt-loader--md" aria-label="Content loading" />
        {loadingMessage && <span>{loadingMessage}</span>}
      </>
    )}
    {!loading && data && children && <>{children}</>}
    {!loading && error}
  </>
);

interface IProps {
  children?: React.ReactNode;
  loadingMessage?: string | React.ReactNode;
}
