import * as React from 'react'
import { Col, List, Panel, Row } from "rivet-react";
import { ISimpleSearchResult } from "../store/searchSimple";

const SimpleSearch: React.SFC<ISimpleSearchResult> =
    (props) => (
        <>
            <Row>
                <Col lg={4}>
                    {props.users &&
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">People</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.users.map((r, i) => (<li key={i}><a href={`/profile/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
                <Col lg={4}>
                    {props.units &&
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">Units</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.units.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
                <Col lg={4}>

                    {props.orgs &&
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">Departments</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.orgs.map((r, i) => (<li key={i}><a href={`/orgs/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>

            </Row>
        </>
    )
export default SimpleSearch
