import { IUnit } from "src/components/types";
import * as React from "react";
    import { List } from "rivet-react";
import { Panel } from "src/components/Panel";

export const UnitList: React.SFC<IProps> = ({units, title}) => 
    <div className="rvt-m-bottom-xl">
        <Panel title={title}>
            { units && units.length !== 0 &&
                <List variant="plain">
                {units.map((r, i) => 
                    <li key={"unit:" + i}>
                        <a href={`/units/${r.id}`}>{r.name}</a>
                        {r.active == false && (<span className="rvt-inline-alert--standalone rvt-inline-alert--info rvt-m-left-xs rvt-ts-xs">Archived</span>)}
                        {r.description && <p>{r.description}</p>}
                    </li>)}
                </List>}
            { !units || units.length === 0 && 
                <p>No units found.</p> }
        </Panel>
    </div>

interface IProps {
    units: IUnit[],
    title?:string
 }