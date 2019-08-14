import * as React from "react";
import { reduxForm, InjectedFormProps } from "redux-form";
import { connect } from "react-redux";
import { Button, ModalBody, List, Row, Col } from "rivet-react";
import { RivetInputField, RivetInput } from "../../form";
import { IApplicationState, IBuilding, IBuildingSupportRelationship } from "../../types";
import { clearCurrent } from "../../lookup";
import { Dispatch } from "redux";
import { lookupBuilding } from "..";
import { Modal, closeModal } from "../../layout/Modal";
import { TrashCan } from "../../icons";
import { deleteUnitBuilding, saveUnitBuilding } from "../store";
import { join } from "src/util";

interface IFormProps extends InjectedFormProps<any>, IDispatchProps, IProps {}
interface IDispatchProps {
  clearCurrent: typeof clearCurrent;
  closeModal: typeof closeModal;
  addBuilding: typeof saveUnitBuilding;
  removeBuilding: typeof deleteUnitBuilding;
  lookupBuilding: typeof lookupBuilding;
}
interface IProps {
  filtered: IBuilding[];
  buildings: IBuildingSupportRelationship[];
  unitId: number;
}

const form: React.SFC<IFormProps> = props => {
  const { addBuilding, clearCurrent, removeBuilding, buildings, closeModal, filtered, reset, lookupBuilding, unitId } = props;
  const handleChange = (e: any) => {
    const q = e.target.value;
    lookupBuilding(q);
  };
  const addBuildingForm = (
    <form>
      <div>
        <RivetInputField
          name="Search buildings"
          component={RivetInput}
          label="Search buildings"
          onChange={handleChange}
          onLoad={handleChange}
        />
      </div>

      {filtered && filtered.length > 0 && (
        <div className="rvt-dropdown__menu" style={{ position: "relative", padding: 0 }}>
          {filtered.map((building: IBuilding, i: number) => {
            return (
              <div key={i}>
                <Button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    addBuilding({ buildingId: building.id, unitId: unitId });
                    closeModal();
                    reset();
                    lookupBuilding("");
                  }}
                >
                  {building.name} <span style={{ fontSize: "smaller", fontWeight: "normal" }}>{[building.address, building.city].join(", ")}</span>
                  
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </form>
  );

  return (
    <>
      <Modal id="add building to unit" title="+ add building" buttonText="+ add building" variant="plain" onOpen={clearCurrent}>
        <ModalBody>{addBuildingForm}</ModalBody>
      </Modal>
      <List variant="plain">
        {buildings.map((relationship: IBuildingSupportRelationship, index: number) => {
          const building = relationship.building;
          return (
            <li key={index}>
              <Row>
                <Col>
                  <h4 className="rvt-text-bold">{building.name}</h4>
                </Col>
                <Col style={{ flexGrow: 0, minWidth: 150, textAlign: "right" }}>
                  <Button variant="plain" type="button" title="Remove Building" onClick={() => confirm(`Are you sure you want to remove ${building.name} as a supported building?`) && removeBuilding(relationship)}>
                    <TrashCan />
                  </Button>
                </Col>
              </Row>
              {(building.address || building.city) && (
                <Row>
                  <Col><span style={{ fontSize: "smaller" }}>{join([building.address, building.city], ", ")}</span></Col>
                </Row>
              )}
            </li>
          );
        })}
      </List>
    </>
  );
};

let UpdateBuildingsForm: any = reduxForm<IFormProps>({
  form: "updateUnitBuildings",
  enableReinitialize: true
})(form);

UpdateBuildingsForm = connect(
  (state: IApplicationState) => {
    const filtered = state.lookup.current;
    return { filtered };
  },
  (dispatch: Dispatch): IDispatchProps => {
    return {
      lookupBuilding: (q: string) => {
        return dispatch(lookupBuilding(q));
      },
      clearCurrent: () => dispatch(clearCurrent()),
      closeModal: () => dispatch(closeModal()),
      addBuilding: building => dispatch(saveUnitBuilding(building)),
      removeBuilding: building => dispatch(deleteUnitBuilding(building))
    };
  }
)(UpdateBuildingsForm);

export default UpdateBuildingsForm;
