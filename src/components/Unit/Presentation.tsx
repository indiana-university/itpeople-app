import * as React from 'react'
import { Col, List, Panel, Row } from "rivet-react";
import { IUnitProfile } from "./store";

const Presentation: React.SFC<IUnitProfile> =
    (props) => {
        
        const admins = props.members.filter(m => m.role === "Admin")
        const coAdmins = props.members.filter(m => m.role === "CoAdmin")
        const pros = props.members.filter(m => m.role === "ItPro")
        const selfs = props.members.filter(m => m.role === "SelfSupport")

        return (
            <>
            <p><a href={props.unit.url}>Unit Website</a></p>
            <Row>
                <Col lg={6}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">Unit Members</h2>
                    <Panel margin={{ top: "xs" }}>
                        {(admins.length > 0 || coAdmins.length > 0) &&
                            <>
                                <h3 className="rvt-ts-20">IT Leadership</h3>
                                <List className="rvt-m-bottom-lg" variant="plain">
                                    {admins.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a> (Admin)</li>))}
                                    {coAdmins.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a> (Co-Admin)</li>))}
                                </List>
                                
                            </>
                        }
                        {pros.length > 0 &&
                            <>
                                <h3 className="rvt-ts-20">IT Professionals</h3>
                                <List className="rvt-m-bot-lg" variant="plain">
                                    {pros.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </>
                        }
                        {selfs.length > 0 && 
                            <>
                                <h3 className="rvt-ts-20 ">Self-Supporting</h3>
                                <List variant="plain">
                                    {selfs.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </>
                        }
                    </Panel>
                </Col>
                <Col lg={6}>
                    {props.supportedDepartments.length > 0 && 
                        <>
                            <h2 className="rvt-ts-26 rvt-m-top-lg">Supported Departments</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.supportedDepartments.map((r, i) => (<li key={i}><a href={`/departments/${r.id}`}>{r.name}</a> ({r.description})</li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
            </Row>
            </>
        )}
export default Presentation
