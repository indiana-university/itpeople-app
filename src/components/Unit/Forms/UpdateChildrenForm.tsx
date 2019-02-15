import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Button, ModalBody, List, Row, Col } from "rivet-react";
import { IApplicationState, IEntity, IUnit } from "../../types";
import { clearCurrent } from "../../lookup";
import { Dispatch } from "redux";
import { closeModal, Modal } from "../../layout/Modal";
import { ChildrenUnitsIcon, TrashCan } from "src/components/icons";
import { deleteUnitChild, saveUnitChild } from "../store";
import AddChildForm from "./AddChildForm";

interface IFormProps extends InjectedFormProps<any>, IUnit, IDispathProps, IProps {}

interface IDispathProps {
  clearCurrent: typeof clearCurrent;
  closeModal: typeof closeModal;
  addChild: typeof saveUnitChild;
  removeChild: typeof deleteUnitChild;
}
interface IProps {
  units: IEntity[];
  unitId: number;
  filteredUnits: IEntity[];
}

const form: React.SFC<IFormProps> = props => {
  const { units, removeChild, clearCurrent } = props;

  

  return (
    <>
      <Modal
        title="Add child unit"
        id="+ add child unit"
        buttonText="+ Add new child"
        variant="plain"
        onOpen={clearCurrent}
      >
        <ModalBody>
          <AddChildForm />
        </ModalBody>
      </Modal>
      <List variant="plain">
        {units &&
          units.map((unit: IEntity, index: number) => {
            return (
              <li key={index}>
                <Row>
                  <Col sm={2}>
                    <ChildrenUnitsIcon width="100%" />
                  </Col>
                  <Col>
                    <h4>{unit.name}</h4>
                    {unit.description && <p className="rvt-ts-14 rvt-m-top-remove">{unit.description}</p>}
                  </Col>
                  <Col style={{ minWidth: "auto", flexGrow: 0, padding: 0, textAlign: "right" }}>
                    <Button variant="plain" type="button" title="Remove Unit" onClick={() => removeChild(unit)}>
                      <TrashCan />
                    </Button>
                  </Col>
                </Row>
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
    const filteredUnits = state.lookup.current;
    return { id, filteredUnits };
  },
  (dispatch: Dispatch): IDispathProps => ({
    clearCurrent: () => dispatch(clearCurrent()),
    closeModal: () => dispatch(closeModal()),
    addChild: unit => dispatch(saveUnitChild(unit)),
    removeChild: (unit: any) => dispatch(deleteUnitChild(unit))
  })
)(UpdateChildrenForm);

export default UpdateChildrenForm;
