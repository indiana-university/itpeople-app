/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState } from "./types";

export const withLoading = <PData, PProps>(Component: React.SFC<PData & PProps>) =>
    class WithLoading extends React.Component<IDefaultState<PData> & PProps> {
        public render() {
            const { loading, error, data, ...rest } = this.props as any
            return (
                <>
                { loading &&
                    <p>Fetching data...</p> 
                }
                { data && 
                    <Component {...data} {...rest} />
                }
                { error &&
                    <p>Errors: {error}</p> 
                }
                </>    
            );
    }
};
