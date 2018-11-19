import * as React from 'react';
import * as Rivet from "rivet-react";

export const Content: React.SFC<IProps> = ({ children, full = false, style = {} }) => {
    if (!full) {
        style = { ...style, maxWidth: 1440, margin: "auto" }
    }

    return <Rivet.Container style={style}>
        {children}
    </Rivet.Container>
}

interface IProps {
    full?: boolean,
    style?: object
}