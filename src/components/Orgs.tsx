import * as React from 'react'
import { Panel, Table } from "rivet-react";
import { IFetchResult } from "../store/orgs";

const Orgs: React.SFC<IFetchResult> =
    (props) => (
        <>
            <Panel margin={{ top: "xs" }}>
                <Table variant="plain" compact={true} >
                    <caption className="sr-only">List of Departments</caption>
                    <tbody>
                        {props.orgs.map((r, i) => (
                            <tr key={i}>
                                <td style={{width:100}}><a href={`/orgs/${r.id}`}>{r.name}</a></td>
                                <td>{r.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Panel>
        </>
    )
export default Orgs
