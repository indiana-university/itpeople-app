import * as React from 'react'
import { Col, List, Panel, Row } from "rivet-react";
import { IFetchResult } from "../store/org";

const Org: React.SFC<IFetchResult> =
    (props) => (
        <>
            <Row>
                <Col lg={6}>
                    {props.units &&
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">Organizational Units</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.units.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
                <Col lg={6}>
                    {props.servicers && 
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">Supporting Units</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.servicers.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
            </Row>
        </>
    )
export default Org
