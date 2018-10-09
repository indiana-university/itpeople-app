import * as React from 'react'
import { Col, List, Panel, Row, Table } from "rivet-react";
import { IProfile } from "../store/profile";

const headerCell = {
    "width": 175,
}

const hasTool = (tools: number, flag: number) =>
    (tools & flag) 
        ? <span style={{marginRight:3}}>✔</span>
        : <span style={{marginLeft:13}}>&nbsp;</span>

const Profile : React.SFC<IProfile> = 
(props) => (
        <>
            <div className="rvt-ts-26">{props.user.position}</div>

            <h2 className="rvt-ts-20 rvt-m-top-lg">Organization</h2>
            <Panel margin={{top:"xs"}}>
                <Table variant="plain" compact={true} >
                    <caption className="sr-only">Organization Information</caption>
                    <tbody>
                        { props.unit && 
                        <tr>
                            <td style={headerCell}><strong>Unit</strong></td>
                            <td><a href={`/units/${props.unit.id}`}>{props.unit.name}</a></td>
                        </tr> }
                        { props.department && 
                        <tr>
                            <td style={headerCell}><strong>HR Department</strong></td>
                            <td><a href={`/departments/${props.department.id}`}>{props.department.name}</a> ({props.department.description})</td>
                        </tr> }
                        
                        { props.user.role && 
                        <tr>
                            <td style={headerCell}><strong>Role</strong></td>
                            <td>{
                                props.user.role === 4 ? "Admin"
                                : props.user.role === 3 ? "Co-Admin"
                                : props.user.role === 2 ? "IT Professional"
                                : props.user.role === 1 ? "Self-Supported"
                                : ""
                            } </td>
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
                    <h2 className="rvt-ts-20 rvt-m-top-lg">Location and Contact</h2>
                    <Panel margin={{top:"xs"}}>
                        <Table variant="plain" compact={true} >
                            <caption className="sr-only">Location and Contact Information</caption>
                            <tbody>
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
                            </tbody>
                        </Table>
                    </Panel>
                </Col>
                <Col lg={4}>

                    { props.supportedDepartments && 
                        <>
                        <h2 className="rvt-ts-20 rvt-m-top-lg">Supported Departments</h2>
                        <Panel margin={{top:"xs"}}>
                            <List variant="plain">
                                {props.supportedDepartments.map((r,i) => (<li key={i}><a href={`/departments/${r.id}`}>{r.name}</a> ({r.description})</li>) )}
                            </List>
                        </Panel>
                        </> 
                    }
                </Col>
                <Col lg={4}>
                    { props.toolsAccess && 
                        <>
                        <h2 className="rvt-ts-20 rvt-m-top-lg">Tools Access</h2>
                        <Panel margin={{top:"xs"}}>
                            <List variant="plain">
                                <li key={1}>{hasTool(props.user.tools, 1)} IT Pro Website</li>
                                <li key={2}>{hasTool(props.user.tools, 2)} IT Pro Mailings</li>
                                <li key={3}>{hasTool(props.user.tools, 4)} IUware</li>
                                <li key={4}>{hasTool(props.user.tools, 8)} MAS</li>
                                <li key={5}>{hasTool(props.user.tools, 16)} Product Keys</li>
                                <li key={6}>{hasTool(props.user.tools, 32)} Account Management</li>
                                <li key={7}>{hasTool(props.user.tools, 64)} AMS Admin</li>
                                <li key={8}>{hasTool(props.user.tools, 128)} UIPO Unblocker</li>
                                <li key={9}>{hasTool(props.user.tools, 256)} SuperPass</li>
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
