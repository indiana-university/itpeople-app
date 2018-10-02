import * as React from 'react'
import { Col, List, Panel, Row, Table } from "rivet-react";
import { IUser } from "../store/profile";

const headerCell = {
    "width": 175,
}

const Profile : React.SFC<IUser> = 
(props) => {
    const nameParts = props.name.split(',')
    const firstName = nameParts[1]
    const lastName = nameParts[0]

    return (
        <>
            <div className="rvt-ts-36 rvt-m-top-lg">{firstName} {lastName}</div>
            <div className="rvt-ts-26">{props.position}</div>

            <h2 className="rvt-ts-20 rvt-m-top-lg">Organization</h2>
            <Panel margin={{top:"xs"}}>
                <Table variant="plain" compact={true} >
                    <caption className="sr-only">Organization Information</caption>
                    <tbody>
                        { props.unit && 
                        <tr>
                            <td style={headerCell}><strong>Unit</strong></td>
                            <td><a href={`/unit/${props.unit.id}`}>{props.unit.name}</a></td>
                        </tr> }
                        { props.role && 
                        <tr>
                            <td style={headerCell}><strong>Role</strong></td>
                            <td>{props.role}</td>
                        </tr> }
                        { props.org && 
                        <tr>
                            <td style={headerCell}><strong>Department</strong></td>
                            <td><a href={`/org/${props.org.id}`}>{props.org.name}</a></td>
                        </tr> }
                        { props.responsibilities && 
                        <tr>
                            <td style={headerCell}><strong>Key Responsibilities</strong></td>
                            <td>{props.responsibilities}</td>
                        </tr> }
                        { props.expertise && 
                        <tr>
                            <td style={headerCell}><strong>Affinities</strong></td>     
                            <td>{props.expertise}</td>
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
                                { props.campus && 
                                <tr>
                                    <td style={headerCell}><strong>Campus</strong></td>
                                    <td>{props.campus}</td>
                                </tr> }
                                <tr>
                                    <td style={headerCell}><strong>Campus Email</strong></td>
                                    <td><a href={`mailto:${props.campusEmail}`}>{props.campusEmail}</a></td>
                                </tr>
                                { props.campusPhone && 
                                <tr>
                                    <td style={headerCell}><strong>Campus Phone</strong></td>
                                    <td>{props.campusPhone}</td>
                                </tr> }
                                { props.location && 
                                <tr>
                                    <td style={headerCell}><strong>Location</strong></td>
                                    <td>{props.location}</td>
                                </tr> }
                            </tbody>
                        </Table>
                    </Panel>
                </Col>
                <Col lg={4}>

                    { props.serviceOrgs && 
                        <>
                        <h2 className="rvt-ts-20 rvt-m-top-lg">Serviced Departments</h2>
                        <Panel margin={{top:"xs"}}>
                            <List variant="plain">
                                {props.serviceOrgs.map((r,i) => (<li key={i}><a href={`/orgs/${r.id}`}>{r.name}</a></li>) )}
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
)}
export default Profile
