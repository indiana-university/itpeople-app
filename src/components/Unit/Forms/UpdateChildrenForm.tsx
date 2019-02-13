import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Button, ModalBody, List, Row, Col } from "rivet-react";
import { RivetInputField, RivetInput, required } from "../../form";
import { IApplicationState, IEntity, IUnit} from "../../types";
import { lookupUnit } from "..";
import { Dispatch } from "redux";
import { closeModal, Modal } from "../../layout/Modal";
import { ChildrenUnitsIcon, TrashCan } from "src/components/icons";
import { deleteUnitChild, saveUnitChild } from "../store";


interface IFormProps extends InjectedFormProps<any>, IUnit, IDispathProps, IProps {}

interface IDispathProps {
  lookupUnit: typeof lookupUnit;
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
  const { closeModal, units, filteredUnits, addChild, removeChild, lookupUnit, unitId } = props;
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
        {filteredUnits && filteredUnits.length > 0 && (
          <div className="rvt-dropdown__menu" style={{ position: "relative", padding: 0 }}>
            {filteredUnits.map((unit: any, i: number) => {
              return (
                <div key={i}>
                  <Button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      addChild({ ...unit, parentId: unitId });
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
      <Modal title="Add child unit" id="+ add child unit" buttonText="+ Add new child" variant="plain">
        <ModalBody>{addChildForm}</ModalBody>
      </Modal>
      <List variant="plain">
        {units &&
          units.map((unit: IEntity, index: number) => {
            return (
              <li key={index}>
                <Row>
                  <Col style={{ minWidth: 60, flexGrow: 0 }}>
                    <ChildrenUnitsIcon width="100%" />
                  </Col>
                  <Col>
                    <h4>{unit.name}</h4>
                  </Col>
                  <Col style={{ minWidth: 150, flexGrow: 0, textAlign: "right" }}>
                    <Button variant="plain" type="button" title="Remove Unit" onClick={() => removeChild(unit)}>
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
    const filteredUnits = state.lookup.current;
    return { id, filteredUnits };
  },
  (dispatch: Dispatch): IDispathProps => ({
    lookupUnit: (q: string) => dispatch(lookupUnit(q)),
    closeModal: () => dispatch(closeModal()),
    addChild: unit => dispatch(saveUnitChild(unit)),
    removeChild: (unit: any) => dispatch(deleteUnitChild(unit))
  })
)(UpdateChildrenForm);

export default UpdateChildrenForm;
