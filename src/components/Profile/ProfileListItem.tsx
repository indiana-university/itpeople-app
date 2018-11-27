import * as React from "react";
import { Row, Col } from "rivet-react";
import { IEntity } from "../types";
    
export const ProfileListItem: React.SFC<IEntity & IProps> = ({ id, name, description, showImage, dark = false }) => {
    return (
        <div className={"rvt-p-all-lg" + ((dark) ? " light-grey-bg" : "")}>
            <Row>
                <Col>
                    {dark}
                    <a href={"/people/" + id} data-modal-trigger="modal-edit-person" className="rvt-m-bottom-remove person-list-item-new-name rvt-text-bold rvt-m-bottom-sm">
                        <span className="viewIcons delFaceName _delete fl">{name}</span>
                    </a>
                    {description &&
                        <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">{description}</p>
                    }
                </Col>
            </Row>
        </div>
    )
}

interface IProps {
    showImage?: boolean,
    dark?: boolean
}