import * as React from 'react'
import { Col, List, Panel, Row, Table } from "rivet-react";
import { IProfile } from "../store/profile";

const headerCell = {
    "width": 175,
}

const hasTool = (tools: string, tool: string) =>
    tools.includes(tool)
        ? <span style={{marginRight:3}}>✔</span>
        : <span style={{marginLeft:13}}>&nbsp;</span>

const Profile : React.SFC<IProfile> = 
(props) => (
        <>
            <div className="rvt-ts-26">{props.user.position}</div>

            <Panel margin={{top:"xs"}}>
                <Table variant="plain" compact={true} >
                    <caption className="sr-only">Personnel Information</caption>
                    <tbody>
                        { props.department && 
                        <tr>
                            <td style={headerCell}><strong>Department</strong></td>
                            <td><a href={`/departments/${props.department.id}`}>{props.department.name}</a> ({props.department.description})</td>
                        </tr> }
                        { props.user.campus && 
                        <tr>
                            <td style={headerCell}><strong>Campus</strong></td>
                            <td>{props.user.campus}</td>
                        </tr> }
                        <tr>
                            <td style={headerCell}><strong>Campus Email</strong></td>
                            <td><a href={`mailto:${props.user.campusEmail}`}>{props.user.campusEmail}</a></td>
                        </tr>
                        { props.user.campusPhone && 
                        <tr>
                            <td style={headerCell}><strong>Campus Phone</strong></td>
                            <td>{props.user.campusPhone}</td>
                        </tr> }
                        { props.user.location && 
                        <tr>
                            <td style={headerCell}><strong>Location</strong></td>
                            <td>{props.user.location}</td>
                        </tr> }
                        {/* { props.user.responsibilities && 
                        <tr>
                            <td style={headerCell}><strong>Key Responsibilities</strong></td>
                            <td>{props.user.responsibilities}</td>
                        </tr> } */}
                        { props.user.expertise && 
                        <tr>
                            <td style={headerCell}><strong>Affinities</strong></td>     
                            <td>{props.user.expertise}</td>
                        </tr> }
                    </tbody>
                </Table>
            </Panel>

            <Row>
                <Col lg={4}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">Units</h2>
                    <Panel margin={{top:"xs"}}>
                        <List variant="plain">
                            {props.unitMemberships.map((u,i) => (<li key={i}><a href={`/units/${u.id}`}>{u.name}</a> ({u.role})</li>) )}
                        </List>
                    </Panel>
                </Col>
                <Col lg={4}>
                    { props.supportedDepartments.length > 0 && 
                        <>
                        <h2 className="rvt-ts-26 rvt-m-top-lg">Supported Departments</h2>
                        <Panel margin={{top:"xs"}}>
                            <List variant="plain">
                                {props.supportedDepartments.map((r,i) => (<li key={i}><a href={`/departments/${r.id}`}>{r.name}</a> ({r.description})</li>) )}
                            </List>
                        </Panel>
                        </> 
                    }
                </Col>
                <Col lg={4}>
                    { props.user.tools && 
                        <>
                        <h2 className="rvt-ts-26 rvt-m-top-lg">Tools Access</h2>
                        <Panel margin={{top:"xs"}}>
                            <List variant="plain">
                                <li key={1}>{hasTool(props.user.tools, "ItProWeb")} IT Pro Website</li>
                                <li key={2}>{hasTool(props.user.tools, "ItProMail")} IT Pro Mailings</li>
                                <li key={3}>{hasTool(props.user.tools, "IUware")} IUware</li>
                                <li key={4}>{hasTool(props.user.tools, "MAS")} MAS</li>
                                <li key={5}>{hasTool(props.user.tools, "ProductKeys")} Product Keys</li>
                                <li key={6}>{hasTool(props.user.tools, "AccountMgt")} Account Management</li>
                                <li key={7}>{hasTool(props.user.tools, "AMSAdmin")} AMS Admin</li>
                                <li key={8}>{hasTool(props.user.tools, "UIPOUnblocker")} UIPO Unblocker</li>
                                <li key={9}>{hasTool(props.user.tools, "SuperPass")} SuperPass</li>
                                {props.toolsAccess.map((t,i) => (<li key={i}>{t.name}</li>) )}
                            </List>
                        </Panel>
                        </> 
                    }
                </Col>
            </Row>
        </>
)
export default Profile
