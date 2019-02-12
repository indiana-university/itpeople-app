import { Panel } from "../../Panel";
import * as React from "react";
import { Row, Col } from "rivet-react";
import { Chevron } from "src/components/icons";
import { IUnitMembership } from "src/components/types";

interface IProps {
  memberships: IUnitMembership[];
  visuallyExpandedUnits: number[];
  toggleUnit(id: number): void;
}

export const Memberships: React.SFC<IProps> = ({ memberships, visuallyExpandedUnits, toggleUnit }) => (
  <Panel title="IT Units">
    <div className="list-dividers profile-units">
      {memberships &&
        memberships.map((membership, i) => {
          const { unit, title, role } = membership;
          if (!unit) {
            return;
          }
          const { id, name, description } = unit;
          const isExpanded = visuallyExpandedUnits.indexOf(id) > -1;
          const toggle = () => {
            toggleUnit(id);
          };
          return (
            <div key={i + "-profile-unit"}>
              <Row>
                <Col>
                  <a href={`/units/${id}`}>
                    <h2 className="rvt-ts-23 rvt-text-bold">{name}</h2>
                  </a>
                  {description && <div className="rvt-m-bottom-sm">{description}</div>}
                </Col>
                <Col sm={1}>
                  <button
                    className={"rvt-button--plain" + (isExpanded ? " expanded" : "")}
                    onClick={toggle}
                    style={{ position: "absolute", right: 0 }}
                  >
                    <span className="sr-only">Toggle</span>
                    <Chevron />
                  </button>
                </Col>
              </Row>
              {isExpanded && (
                <Row>
                  <Col>
                    {title && (
                      <div className="rvt-m-top-sm">
                        <span className="rvt-text-bold">Title: </span>
                        {title}
                      </div>
                    )}

                    {role && (
                      <div className="rvt-m-top-sm">
                        <span className="rvt-text-bold">Role: </span>
                        {role}
                      </div>
                    )}
                    {/* {m.tools && m.tools.length > 0 && (
                            <div className="rvt-m-top-sm">
                                <h3 className="rvt-ts-16 rvt-text-bold">
                                    Tools
                    </h3>
                                <List variant="plain">
                                    {m.tools.map((t, i) => (
                                        <li key={i}>{t}</li>
                                    ))}
                                </List>
                            </div>
                        )} */}
                  </Col>
                </Row>
              )}
            </div>
          );
        })}
    </div>
  </Panel>
);
