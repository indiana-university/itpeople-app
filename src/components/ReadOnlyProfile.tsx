import * as React from 'react'
import { List, Table } from "rivet-react";
import { IUser } from "../store/profile";

const tableBorder = {
    border: "1px solid #ddd"
}
const cellWhite = {
    width:"16.66%",
    
}
const cellGray = {
    "background-color": "#eeeeee",
    width:"16.66%"
}

const ReadOnlyProfile : React.SFC<IUser> = 
(props) => (
    <>
        <div className="rvt-ts-36 rvt-m-top-lg">{props.name}</div>
        <div className="rvt-ts-26">{props.position}</div>
        <div className="rvt-ts-26"><a href={`mailto:${props.campusEmail}`}>{props.campusEmail}</a></div>

        <Table className="rvt-m-top-lg" style={tableBorder} cells={true}>
            <tbody>
                <tr>
                    <td style={cellGray}>Unit</td>
                    <td style={cellWhite}>{props.unit.name}</td>
                    <td style={cellGray}>Campus</td>
                    <td style={cellWhite}>{props.campus}</td>
                    <td style={cellGray}>Role</td>
                    <td style={cellWhite}>{props.role}</td>
                </tr>
                <tr>
                    <td style={cellGray}>Org</td>
                    <td> <a href={`/org/${props.org.id}`}>{props.org.name}</a></td>
                    <td style={cellGray}>NetId</td>
                    <td>{props.netId}</td>
                    <td style={cellGray}>Phone</td>
                    <td>{props.campusPhone}</td>
                </tr>
                <tr>
                    <td style={cellGray}>Key Responsibilities</td>
                    <td colSpan={5}>{props.responsibilities}</td>
                </tr>
                <tr>
                    <td style={cellGray}>Skills / Experience / Affinities</td>
                    <td colSpan={5}>{props.expertise}</td>
                </tr>
            </tbody>
        </Table>

        { props.serviceOrgs && 
            <>
              <h3 className="rvt-m-top-lg">IT Organizations</h3>
              <List>
                {props.serviceOrgs.map(r => (<li><a href={`/orgs/${r.id}`}>{r.name}</a></li>) )}
              </List>
            </>
        }

        { props.toolsAccess && 
            <>
              <h3 className="rvt-m-top-lg">Tool Access</h3>
              <List>
                {props.toolsAccess.map(t => (<li>{t.name}</li>) )}
              </List>
            </>
        }
    </>
)
export default ReadOnlyProfile
