import * as React from 'react'
import { List, Panel } from "rivet-react";
import { IUnitList } from '../store/units';

const Units: React.SFC<IUnitList> =
    (props) => {
        console.log("props",props)
        return (
        <>
            <Panel margin={{ top: "xs" }}>
                <List variant="plain">
                    {props.units.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                </List>
            </Panel>
        </>
    )}
export default Units
