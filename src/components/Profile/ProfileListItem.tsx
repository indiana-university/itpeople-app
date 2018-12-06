import * as React from "react";
import { Row, Col } from "rivet-react";
import { IEntity } from "../types";

export const ProfileListItem: React.SFC<IEntity & IProps> = ({
  id,
  name,
  description,
  photoUrl
}) => {
  return <div className="rvt-p-tb-lg">
      <Row>
        {photoUrl && 
        <Col sm={3} style={{maxWidth:"180px"}}>
            <img src={photoUrl} width={"100%"} style={{ borderRadius: "100%", overflow: "hidden", objectFit: "cover" }} />
          </Col>}
        <Col style={{ alignSelf: "center" }}>
          <a href={"/people/" + id} data-modal-trigger="modal-edit-person" className="rvt-m-bottom-remove person-list-item-new-name rvt-text-bold rvt-m-bottom-sm">
            <span className="viewIcons delFaceName _delete fl">{name}</span>
          </a>
          {description && <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">
              {description}
            </p>}
        </Col>
      </Row>
    </div>;
};

interface IProps {
  photoUrl?: string;
}
