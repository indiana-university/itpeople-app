import { IState } from "../store";
import { Content } from "src/components/layout";
import { Row, Col } from "rivet-react";
import * as React from "react";
import { PersonBanner, PersonDetails, Memberships } from "./";
import { Loader } from "src/components/Loader";
import { IPerson, Permissions } from "src/components/types";

export const View: React.SFC<IProps> = ({ person, memberships, visuallyExpandedUnits, toggleUnit, editJobClasses, closeModal, save }) => (
  <>
    <Loader {...person}>{person && person.data && <PersonBanner {...person.data} />}</Loader>
    <Content className="rvt-bg-white">
      <Row data-testid="profile-page" className="rvt-p-top-lg">
        <Col md={6} className="rvt-p-all-lg">
          <Loader {...person}>{person && person.data && <PersonDetails person={person.data} canEdit={Permissions.canPut(person.permissions)} editJobClasses={editJobClasses} closeModal={closeModal} save={save} />}</Loader>
        </Col>
        <Col md={6} className="rvt-p-all-lg">
          <Loader {...memberships}>
            {memberships && memberships.data && memberships.data.length > 0  && (
              <Memberships memberships={...memberships.data} visuallyExpandedUnits={visuallyExpandedUnits} toggleUnit={toggleUnit} />
            )}
          </Loader>
        </Col>
      </Row>
    </Content>
  </>
);

interface IProps extends IState {
  toggleUnit: (id: number) => void;
  editJobClasses: (j: string[]) => any;
  closeModal: () => any
  save: (person:IPerson)=>any
}
