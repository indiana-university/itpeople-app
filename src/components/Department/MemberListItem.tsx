import * as React from "react";
import { Row, Col } from "rivet-react";
import { IEntity } from "../types";

export const MemberListItem: React.SFC<IEntity & IProps> = ({ id, name, description, dark = false }) => {
    return (
        <div className={"rvt-p-all-lg" + ((dark) ? " light-grey-bg" : "")}>
            <Row>
                <Col style={{ alignSelf: "center" }}>
                    <a href={"/people/" + id}>{name}</a>
                    {description && <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">{description}</p>}
                </Col>
            </Row>
        </div>
    )
}

interface IProps {
    dark?: boolean
}