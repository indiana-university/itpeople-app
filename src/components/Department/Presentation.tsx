import * as React from 'react'
import { Row, Col } from "rivet-react";
import { IDepartmentProfile } from "./store";
import PageTitle from '../layout/PageTitle';

const Presentation: React.SFC<IDepartmentProfile> = (props) => {
    const name = props.name;
    const description = props.description;
    const members = props.members || [];
    const units = props.units || [];
    const supportingUnits = props.supportingUnits || [];
    return <>
        <PageTitle>{name}</PageTitle>
        {description && <p>{description}</p>}
        <Row>
            <Col>
                {members && members.length > 0 &&
                    <div>
                        <h2 className="rvt-ts-26 rvt-m-top-lg">IT Professional Staff</h2>
                        <ul>
                            {members.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                        </ul>
                    </div>
                }

                {units.length > 0 &&
                    <div>
                        <h2 className="rvt-ts-26 rvt-m-top-lg">Constituent Units</h2>
                        <ul>
                            {units.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                        </ul>
                    </div>
                }

                {supportingUnits.length > 0 &&
                    <div>
                        <h2 className="rvt-ts-26 rvt-m-top-lg">Supporting Units</h2>
                        <ul>
                            {supportingUnits.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                        </ul>
                    </div>
                }
            </Col>
        </Row>
    </>
}
export default Presentation
