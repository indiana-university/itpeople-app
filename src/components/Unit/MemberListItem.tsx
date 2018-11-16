import * as React from "react";
import { IUnitMember } from "./store";
import { Row, Col } from "rivet-react";

const getItials = (name:string)=>{
    return name.split(' ').map(p => {
        return p[0] || "";
    }).join('');
}

export const MemberListItem: React.SFC<IUnitMember> = ({ id, name, title }) => {
    return (
        <Row className="person-list-item-new">
            <Col>
                <div className="profile--image-wrap">
                    {getItials(name)}
                    <img />
                </div>
            </Col>
            <Col md={10}>
                <a href={"/profiles/" + id} data-modal-trigger="modal-edit-person" className="rvt-m-bottom-remove person-list-item-new-name rvt-text-bold rvt-m-bottom-sm">
                    <span className="viewIcons delFaceName _delete fl">{name}</span>
                </a>
                {title &&
                    <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">{title}</p>
                }
            </Col>
        </Row>
    )
}
