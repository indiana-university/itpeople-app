import { IUnitMembership } from "../store";
import { Panel } from "../../Panel";
import * as React from "react";
import { Row, Col } from "rivet-react";
import { Chevron } from "src/components/icons";

interface IProps {
    memberships: IUnitMembership[],
    visuallyExpandedUnits: number[],
    toggleUnit(id: number): void;
}

export const Memberships: React.SFC<IProps> = ({memberships, visuallyExpandedUnits, toggleUnit}) =>
    <Panel title="IT Units">
            <div className="list-dividers profile-units">
                {memberships && memberships.map((m, i) => {

                    const isExpanded = visuallyExpandedUnits.indexOf(m.id) > -1;
                    const toggle = () => {
                        toggleUnit(m.id);
                    };
                    return (
                        m.unit &&
                        <div key={i + "-profile-unit"}>
                            <Row>
                                <Col>
                                    <a href={`/units/${m.id}`}>
                                        <h2 className="rvt-ts-23 rvt-text-bold">
                                            {m.unit.name}
                                        </h2>
                                    </a>
                                    {m.unit.description && (
                                        <div className="rvt-m-bottom-sm">
                                            {m.unit.description}
                                        </div>
                                    )}
                                </Col>
                                <Col sm={1}>
                                    <button
                                        className={
                                            "rvt-button--plain" +
                                            (isExpanded ? " expanded" : "")
                                        }
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
                                        {m.title && (
                                            <div className="rvt-m-top-sm">
                                                <span className="rvt-text-bold">Title: </span>
                                                {m.title}
                                            </div>
                                        )}

                                        {m.role && (
                                            <div className="rvt-m-top-sm">
                                                <span className="rvt-text-bold">Role: </span>
                                                {m.role}
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