import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Button, ModalBody, ModalControls, List, Row, Col } from "rivet-react";
import { RivetInputField, RivetInput, required } from "../../form";
import { IApplicationState, IEntity } from "../../types";
import { lookupUnit } from "..";
import { Dispatch } from "redux";
import { closeModal, Modal } from "../../layout/Modal";
import { ChildrenUnitsIcon, TrashCan } from "src/components/icons";
import { IUnitProfile } from "../store";

interface IFormProps
  extends InjectedFormProps<any>,
    IUnitProfile,
    IDispathProps,
    IProps {}

interface IDispathProps {
  lookupUnit: typeof lookupUnit;
  closeModal: typeof closeModal;
  addChild(unit: any): any; // <-- TODO: wire up store
  removeChild(unit: any): any; // <-- TODO: wire up store
}
interface IProps {
  units: any;
}

const form: React.SFC<IFormProps> = props => {
  const { closeModal, children, addChild, removeChild, lookupUnit } = props;
  const addChildForm = (
    <>
      <form>
        <div>
          <RivetInputField
            name="q"
            component={RivetInput}
            label="Search"
            validate={[required]}
            onChange={(e: any) => {
              const q = e.target.value;
              props.lookupUnit(q);
            }}
            onLoad={(e: any) => {
              const q = e.target.value;
              props.lookupUnit(q);
            }}
          />
        </div>
        {props.units && props.units.length > 0 && (
          <div
            className="rvt-dropdown__menu"
            style={{ position: "relative", padding: 0 }}
          >
            {props.units.map((unit: any, i: number) => {
              // todo: circular reference check
              // todo: check if relationship already exists
              return (
                <div key={i}>
                  <Button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      addChild(unit);
                      closeModal();
                      props.reset();
                      lookupUnit("");
                    }}
                  >
                    {unit && unit.name}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </form>
    </>
  );

  return (
    <>
      <Modal
        title="Add child unit"
        id="+ add child unit"
        buttonText="+ Add new child"
        variant="plain"
      >
        <ModalBody>{addChildForm}</ModalBody>
        <ModalControls>
          <Button type="button" onClick={closeModal} variant="plain">
            Cancel
          </Button>
        </ModalControls>
      </Modal>
      <List variant="plain">
        {children &&
          children.map((unit: IEntity, index: number) => {
            return (
              <li key={index}>
                <Row>
                  <Col style={{ minWidth: 60, flexGrow: 0 }}>
                    <ChildrenUnitsIcon width="100%" height="auto" />
                  </Col>
                  <Col>
                    <h4>{unit.name}</h4>
                  </Col>
                  <Col
                    style={{ minWidth: 150, flexGrow: 0, textAlign: "right" }}
                  >
                    <Button
                      variant="plain"
                      type="button"
                      title="Remove Unit"
                      onClick={() => removeChild(unit)}
                    >
                      <TrashCan />
                    </Button>
                  </Col>
                </Row>
                {unit.description && (
                  <Row className="rvt-grid">
                    <Col style={{ minWidth: 60, flexGrow: 0 }} />
                    <Col className="rvt-grid__item">{unit.description}</Col>
                  </Row>
                )}
              </li>
            );
          })}
      </List>
    </>
  );
};

let UpdateChildrenForm: any = reduxForm<IFormProps>({
  form: "updateUnitChildren",
  enableReinitialize: true
})(form);

const selector = formValueSelector("updateUnitChildren");
UpdateChildrenForm = connect(
  (state: IApplicationState) => {
    const id = selector(state, "id");
    const units = state.lookup.current;
    return { id, units };
  },
  (dispatch: Dispatch): IDispathProps => ({
    lookupUnit: (q: string) => dispatch(lookupUnit(q)),
    closeModal: () => dispatch(closeModal()),
    addChild: (unit: any) => {}, // <-- TODO: wire up store
    removeChild: (unit: any) => {} // <-- TODO: wire up store
  })
)(UpdateChildrenForm);

export default UpdateChildrenForm;
