import * as React from 'react'
import { Col, List, Panel, Row, Table } from "rivet-react";
import { IProfile } from "../store/profile";

const headerCell = {
    "width": 175,
}

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
                        { props.user.role && 
                        <tr>
                            <td style={headerCell}><strong>Role</strong></td>
                            <td>{props.user.role}</td>
                        </tr> }
                        { props.department && 
                        <tr>
                            <td style={headerCell}><strong>Department</strong></td>
                            <td><a href={`/departments/${props.department.id}`}>{props.department.name}</a></td>
                        </tr> }
                        { props.user.responsibilities && 
                        <tr>
                            <td style={headerCell}><strong>Key Responsibilities</strong></td>
                            <td>{props.user.responsibilities}</td>
                        </tr> }
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
                        <h2 className="rvt-ts-20 rvt-m-top-lg">Serviced Departments</h2>
                        <Panel margin={{top:"xs"}}>
                            <List variant="plain">
                                {props.supportedDepartments.map((r,i) => (<li key={i}><a href={`/departments/${r.id}`}>{r.name}</a></li>) )}
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
