import { IState } from "../store";
import { Content } from "src/components/layout";
import { Row, Col } from "rivet-react";
import * as React from "react";
import { PersonBanner, PersonDetails, Memberships } from "./";
import { Loader } from "src/components/Loader";

export const View: React.SFC<IProps> = ({ person, memberships, visuallyExpandedUnits, toggleUnit }) => (
  <>
    <Loader {...person}>{person && person.data && <PersonBanner {...person.data} />}</Loader>
    <Content className="rvt-bg-white">
      <Row className="rvt-p-top-lg">
        <Col md={6} className="rvt-p-all-lg">
          <Loader {...person}>{person && person.data && <PersonDetails {...person.data} />}</Loader>
        </Col>
        <Col md={6} className="rvt-p-all-lg">
          <Loader {...memberships}>
            {memberships && memberships.data && (
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
}
