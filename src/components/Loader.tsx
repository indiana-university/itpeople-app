import * as React from "react";
import { IApiState2 } from "./types";

export const Loader = (props: IApiState2<any> & IProps) => (
    <>
        {props.loading &&
            <p>Loading profile...</p>
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
    children?: React.ReactNode
}