import * as React from "react";
import { IUnitMember } from "./store";

export const MemberListItem: React.SFC<IUnitMember> = ({ id, name, title }) => {
    return (
        <div className="person-list-item-new">
            <a href={"/profiles/" + id} data-modal-trigger="modal-edit-person" className="rvt-m-bottom-remove person-list-item-new-name rvt-text-bold rvt-m-bottom-sm">
                <span className="viewIcons delFaceName _delete fl">{name}</span>
            </a>
            {title &&
                <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">{title}</p>
            }
        </div>
    )
}
