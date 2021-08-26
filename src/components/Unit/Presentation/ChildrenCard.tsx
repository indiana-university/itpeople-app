/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from 'react'
import { Col, Row } from 'rivet-react'
import { EntityComparer, IUnit } from "../../types";
import { ChildrenUnitsIcon } from '../../icons';

interface IProps {
    children?: IUnit[]
}
export const ChildrenCard: React.SFC<IProps> = (props) => {
    const children = props.children;
    return (
        <>
            {
                children &&
                children
                    .sort(EntityComparer)
                    .map((child, i) => (
                    <Row key={i}>
                        <Col sm={2}><ChildrenUnitsIcon width="100%" /></Col>
                        <Col>
                            <div className="related-group rvt-m-bottom-md" id="user-research">
                                <a href={`/units/${child.id}`} className="rvt-m-bottom-remove related-group-item-name rvt-text-bold">{child.name}</a>
                                {child.active == false && (<span className="rvt-inline-alert--standalone rvt-inline-alert--info rvt-m-left-xs rvt-ts-xs">Archived</span>)}
                                <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">{child.description}</p>
                            </div>
                        </Col>
                    </Row>
                ))
            }
        </>
    )
}