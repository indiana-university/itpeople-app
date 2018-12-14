import * as React from 'react'
import {Col, Row} from 'rivet-react'
import { IEntity } from "../../types";
import { ParentUnitIcon } from '../../icons';

interface IProps {
    parent?: IEntity
}
export const ParentCard: React.SFC<IProps> = (props) => {
    const parent = props.parent;
    return (
        <>
            {
                parent && 
                <div className="rvt-m-bottom-xl">
                    <Row>
                        <Col sm={2}> <ParentUnitIcon width="100%" /> </Col>
                        <Col>
                        <a href={`/units/${parent.id}`} className="rvt-m-bottom-remove related-group-item-name rvt-text-bold">{parent.name}</a>
                        {parent.description &&
                            <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">{parent.description}</p>
                        }
                        </Col>
                    </Row>
                </div>
            }
        </>
    )
}