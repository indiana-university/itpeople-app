import * as React from 'react'
import { Panel, Table } from "rivet-react";
import { IFetchResult } from "../store/departments";

const Departments: React.SFC<IFetchResult> =
    (props) =>{ 
        
        console.log("departments", props)
        return (
        <>
            <Panel margin={{ top: "xs" }}>
                <Table variant="plain" compact={true} >
                    <caption className="sr-only">List of Departments</caption>
                    <tbody>
                        {props.departments.map((r, i) => (
                            <tr key={i}>
                                <td style={{width:100}}><a href={`/departments/${r.id}`}>{r.name}</a></td>
                                <td>{r.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Panel>
        </>
    )}
export default Departments
