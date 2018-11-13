import * as React from 'react'
import { Checkbox, Col, List, Panel, Row, Table } from "rivet-react";
import { IUserProfile } from "./store";
import PageTitle from '../layout/PageTitle';

const headerCell = {
    "width": 175,
}

const formatRole = (role: string) => {
    switch (role) {
        case "Admin": return "Admin"; break;
        case "CoAdmin": return "Co-Admin";
        case "ItPro": return "IT Pro";
        case "SelfSupport": return "Self-Supported";
        default: return "Unknown"
    }
}

const has = (vals: string, val: string) : boolean =>
    vals.toString().includes(val)


const Presentation : React.SFC<IUserProfile> = (props) => (
        <>

            <PageTitle>{props.user.name}</PageTitle>
            <div className="rvt-ts-26">{props.user.position}</div>

            <Panel margin={{top:"xs"}}>
                <Table variant="plain" compact={true} >
                    <caption className="sr-only">Personnel Information</caption>
                    <tbody>
                        { props.user.role && 
                        <tr>
                            <td style={headerCell}><strong>Role</strong></td>
                            <td>{formatRole(props.user.role)}</td>
                        </tr> }
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
                    <h2 className="rvt-ts-26 rvt-m-top-lg">Responsibilities</h2>
                    <Panel margin={{top:"xs"}}>
                        <List variant="plain">
                            <li key={0}><Checkbox disabled={true} checked={has(props.user.responsibilities, "ItLeadership")} label="IT Leadership" /></li>
                            <li key={1}><Checkbox disabled={true} checked={has(props.user.responsibilities, "BizSysAnalysis")} label="Business/Systems Analysis" /></li>
                            <li key={2}><Checkbox disabled={true} checked={has(props.user.responsibilities, "DataAdminAnalysis")} label="Data Administration and Analysis" /></li>
                            <li key={3}><Checkbox disabled={true} checked={has(props.user.responsibilities, "DatabaseArchDesign")} label="Database Architecture and Design" /></li>
                            <li key={4}><Checkbox disabled={true} checked={has(props.user.responsibilities, "InstructionalTech")} label="Instructional Technology" /></li>
                            <li key={5}><Checkbox disabled={true} checked={has(props.user.responsibilities, "ItProjectMgt")} label="Project Management" /></li>
                            <li key={6}><Checkbox disabled={true} checked={has(props.user.responsibilities, "ItSecurityPrivacy")} label="Security and Privacy" /></li>
                            <li key={7}><Checkbox disabled={true} checked={has(props.user.responsibilities, "ItUserSupport")} label="User Support" /></li>
                            <li key={8}><Checkbox disabled={true} checked={has(props.user.responsibilities, "ItMultiDiscipline")} label="Multi-disciplinary IT Services" /></li>
                            <li key={9}><Checkbox disabled={true} checked={has(props.user.responsibilities, "Networks")} label="Network Administration, Analysis, and Engineering" /></li>
                            <li key={10}><Checkbox disabled={true} checked={has(props.user.responsibilities, "SoftwareAdminAnalysis")} label="Software/Application Administration and Analysis" /></li>
                            <li key={11}><Checkbox disabled={true} checked={has(props.user.responsibilities, "SoftwareDevEng")} label="Software/Application Development and Engineering" /></li>
                            <li key={12}><Checkbox disabled={true} checked={has(props.user.responsibilities, "SystemDevEng")} label="Systems Design, Development, and Engineering" /></li>
                            <li key={13}><Checkbox disabled={true} checked={has(props.user.responsibilities, "UserExperience")} label="User Experience" /></li>
                            <li key={14}><Checkbox disabled={true} checked={has(props.user.responsibilities, "WebAdminDevEng")} label="Web Administration, Design, and Development" /></li>
                        </List>
                    </Panel>
                </Col>
                <Col lg={4}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">Tools</h2>
                    <Panel margin={{top:"xs"}}>
                        <List variant="plain">
                            <li key={1}><Checkbox disabled={true} checked={has (props.user.tools, "ItProWeb")} label="IT Pro Website" /></li>
                            <li key={2}><Checkbox disabled={true} checked={has (props.user.tools, "ItProMail")} label="IT Pro Mailings" /></li>
                            <li key={3}><Checkbox disabled={true} checked={has (props.user.tools, "IUware")} label="IUware" /></li>
                            <li key={4}><Checkbox disabled={true} checked={has (props.user.tools, "MAS")} label="MAS" /></li>
                            <li key={5}><Checkbox disabled={true} checked={has (props.user.tools, "ProductKeys")} label="Product Keys" /></li>
                            <li key={6}><Checkbox disabled={true} checked={has (props.user.tools, "AccountMgt")} label="Account Management" /></li>
                            <li key={7}><Checkbox disabled={true} checked={has (props.user.tools, "AMSAdmin")} label="AMS Admin" /></li>
                            <li key={8}><Checkbox disabled={true} checked={has (props.user.tools, "UIPOUnblocker")} label="UIPO Unblocker" /></li>
                            <li key={9}><Checkbox disabled={true} checked={has (props.user.tools, "SuperPass")} label="SuperPass" /></li>
                        </List>
                    </Panel>
                </Col>
                <Col lg={4}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">Units</h2>
                    <Panel margin={{top:"xs"}}>
                        <List variant="plain">
                            {props.unitMemberships.map((u,i) => (<li key={i}><a href={`/units/${u.id}`}>{u.name}</a></li>) )}
                        </List>
                    </Panel>
                </Col>
            </Row>
        </>
)
export default Presentation
