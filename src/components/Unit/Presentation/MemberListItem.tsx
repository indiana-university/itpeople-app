import * as React from "react";
import { IUnitMember } from "../store";
import { Row, Col } from "rivet-react";

export const MemberListItem: React.SFC<IUnitMember & IProps> = ({
  id,
  name,
  title,
  photoUrl,
  showImage
}) => {
  return (
    <div>
      <Row>
        {showImage && photoUrl && (
          <Col sm={2}>
            <img
              src={photoUrl}
              width={"100%"}
              style={{
                borderRadius: "100%",
                overflow: "hidden",
                objectFit: "cover"
              }}
            />
          </Col>
        )}
        <Col style={{ alignSelf: "center" }}>
          <a
            href={"/people/" + id}
            data-modal-trigger="modal-edit-person"
            className="rvt-m-bottom-remove person-list-item-new-name rvt-text-bold rvt-m-bottom-sm rvt-ts-18"
          > 
            <span className="viewIcons delFaceName _delete fl">{name}</span>
          </a>
          {title && (
            <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">
              {title}
            </p>
          )}
        </Col>
      </Row>
    </div>
  );
};

interface IProps {
  showImage?: boolean;
}
