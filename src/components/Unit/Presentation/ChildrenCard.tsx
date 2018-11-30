import * as React from 'react'
import { Col, Row } from 'rivet-react'
import { IEntity } from "../../types";
import { ChildrenUnitsIcon } from '../../icons';

interface IProps {
    children?: IEntity[]
}
export const ChildrenCard: React.SFC<IProps> = (props) => {
    const children = props.children;
    return (
        <>
            {
                children && children.length &&
                <>
                    {
                        children.map((child, i) => (
                            <Row key={i}>
                                <Col sm={2}><ChildrenUnitsIcon width="100%" /></Col>
                                <Col>
                                    <div className="related-group rvt-m-bottom-md" id="user-research">
                                        <a href={`/units/${child.id}`} className="rvt-m-bottom-remove related-group-item-name rvt-text-bold">{child.name}</a>
                                        <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">{child.description}</p>
                                    </div>
                                </Col>
                            </Row>
                        ))
                    }
                </>
            }
        </>
    )
}