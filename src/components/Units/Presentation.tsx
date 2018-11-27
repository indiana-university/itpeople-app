import * as React from 'react'
import { List, Panel } from "rivet-react";
import { IEntity } from '../types';

interface IProps {
    units: IEntity[]
}

const Presentation: React.SFC<IProps> =
    (props) => {
        console.log("props", props)
        return (
            <Panel margin={{ top: "xs" }}>
                <List variant="plain">
                    {props.units.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                </List>
            </Panel>
        )
    }
export default Presentation
