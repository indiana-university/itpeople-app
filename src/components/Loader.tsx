/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState } from "./types";
import NotFound from './Errors/404'

export const Loader = (props: IDefaultState<any> & IProps) => {
    const loading = props.loading;
    return <>
        {loading &&
            <>
            {props.loadingMessage ?
                <p> { props.loadingMessage}</p>
                :
                <p>Loading... </p>
            }
            </>

        }
        {!loading && props.data && props.children &&
            <>{props.children}</>
        }
        {!loading && props.error &&
            <NotFound error={props.error} />
        }
    </>
}

interface IProps {
    children?: React.ReactNode,
    loadingMessage?: string | React.ReactNode
}