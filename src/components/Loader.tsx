import * as React from "react";
import { IApiState2 } from "../store/common";

export const Loader: React.SFC<IApiState2<any>> = 
({ loading, data, error, children }) => {
    return (
        <>
        { loading &&
            <p>Fetching data...</p> 
        }
        { children }
        { error &&
            <p>Errors: {error}</p> 
        }
        </>  
    )
}
