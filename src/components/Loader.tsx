import * as React from "react";
import { IApiState2 } from "./types";

export const Loader = (props: IApiState2<any> & IProps) => (
    <>
        {props.loading &&
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
            <p>{props.error}</p>
        }
    </>
)

interface IProps {
    children?: React.ReactNode,
    loadingMessage?: string | React.ReactNode
}