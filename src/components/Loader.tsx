import * as React from "react";
import { IApiState2 } from "./types";
import NotFound from './Errors/404'

export const Loader = (props: IApiState2<any> & IProps) => {
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
        {props.data && props.children &&
            <>{props.children}</>
        }
        {props.error &&
            <NotFound error={props.error} />
        }
    </>
}

interface IProps {
    children?: React.ReactNode,
    loadingMessage?: string | React.ReactNode
}