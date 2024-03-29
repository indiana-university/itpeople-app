/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from 'react'
import {Col, Row} from 'rivet-react'
import { IUnit } from "../../types";
import { ParentUnitIcon } from '../../icons';

interface IProps {
    parent?: IUnit
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
                        {parent.active == false && (<span className="rvt-inline-alert--standalone rvt-inline-alert--info rvt-m-left-xs rvt-ts-xs">Archived</span>)}
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