import * as React from "react";
import { Col, Row } from "rivet-react";
import { IPerson } from "../../types";
import PageTitle from "../../layout/PageTitle";
import { Breadcrumbs, Content } from "../../layout";

export const PersonBanner: React.SFC<IPerson> = ({name, position, photoUrl}) => 
    <>
        <Breadcrumbs
            crumbs={[{ text: "Home", href: "/" }, "Profiles", name]}
        />
        <Content>
            <div className="rvt-bg-white">
                {photoUrl && (
                    <Row
                        style={{
                            justifyContent: "center",
                            marginTop: "14em",
                            marginBottom: "-1em"
                        }}
                        className="rvt-p-lr-md"
                    >
                        <Col md={4} lg={3} style={{ marginTop: "-10em" }}>
                            <div
                                style={{
                                    borderRadius: "100%",
                                    overflow: "hidden",
                                    objectFit: "cover"
                                }}
                            >
                                <img
                                    src={photoUrl}
                                    alt={`${name}`}
                                    width={"100%"}
                                    style={{
                                        borderRadius: "100%",
                                        overflow: "hidden",
                                        objectFit: "cover"
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                )}

                <Row style={{ justifyContent: "center" }}>
                    <Col md={9} className="rvt-text-center rvt-m-top-md">
                        <PageTitle>{name}</PageTitle>
                        <div className="rvt-ts-26">{position}</div>                            
                    </Col>
                </Row>
            </div>
        </Content>
    </>
