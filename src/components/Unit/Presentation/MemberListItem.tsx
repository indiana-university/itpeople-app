import * as React from "react";
import { IUnitMember } from "../store";
import { Row, Col } from "rivet-react";

const getItials = (name: string) => {
  return name
    .split(" ")
    .map(p => {
      return p[0] || "";
    })
    .join("");
};

export const MemberListItem: React.SFC<IUnitMember & IProps> = ({
  id,
  name,
  title,
  photoUrl,
  showImage,
  dark = false
}) => {
  return (
    <Row className="rvt-p-all-lg">
      {showImage && (
        <Col sm={2}>
          {photoUrl ? (
            <img
              src={photoUrl}
              width={"100%"}
              style={{
                borderRadius: "100%",
                overflow: "hidden",
                objectFit: "cover"
              }}
            />
          ) : (
            <div className="profile--image-wrap">{getItials(name)}</div>
          )}
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
  );
};

interface IProps {
  showImage?: boolean;
  dark?: boolean;
}
