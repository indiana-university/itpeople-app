import * as React from "react";
import { reduxForm, InjectedFormProps } from "redux-form";
import { connect } from "react-redux";
import { Button, ModalBody, List, Row, Col } from "rivet-react";
import { RivetInputField, RivetInput, RivetSelectField, RivetSelect } from "../../form";
import { IApplicationState, IDepartment, ISupportRelationship, ISupportType } from "../../types";
import { clearCurrent } from "../../lookup";
import { Dispatch } from "redux";
import { lookupDepartment } from "..";
import { Modal, closeModal } from "../../layout/Modal";
import { TrashCan } from "../../icons";
import { deleteUnitDepartment, saveUnitDepartment } from "../store";

interface IFormProps extends InjectedFormProps<any>, IDispatchProps, IProps {}
interface IDispatchProps {
  clearCurrent: typeof clearCurrent;
  closeModal: typeof closeModal;
  addDepartment: typeof saveUnitDepartment;
  removeDepartment: typeof deleteUnitDepartment;
  lookupDepartment: typeof lookupDepartment;
}
interface IProps {
  filtered: IDepartment[];
  departments: ISupportRelationship[];
  supportTypes: ISupportType[];
  unitId: number;
}

const form: React.SFC<IFormProps> = props => {
  const { addDepartment, clearCurrent, removeDepartment, departments, supportTypes, closeModal, filtered, reset, lookupDepartment, unitId } = props;
  const handleChange = (e: any) => {
    const q = e.target.value;
    lookupDepartment(q);
  };
  const addDepartmentForm = (
    <form>
      <div>
        <RivetInputField
          name="Search departments"
          component={RivetInput}
          label="Search departments"
          onChange={handleChange}
          onLoad={handleChange}
        />
      </div>

      {filtered && filtered.length > 0 && (
        <div className="rvt-dropdown__menu" style={{ position: "relative", padding: 0 }}>
          {filtered.map((department, i) => {
            return (
              <div key={i}>
                <Button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    addDepartment({ departmentId: department.id, unitId: unitId });
                    closeModal();
                    reset();
                    lookupDepartment("");
                  }}
                >
                  {department && department.name}
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <div>
        <RivetSelectField name="supportType" component={RivetSelect} label="Support Type">
          <option value="">None</option>
          {supportTypes.map((supportType, i) =>{
              return (
              <option key={i} value={supportType.id}>{supportType.name}</option>
            );
          })}
        </RivetSelectField>
        <br/>
        <Button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            // TODO submit form
            closeModal();
            reset();
            lookupDepartment("");
          }}
        >Add Support Relationship
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <Modal id="add department to unit" title="+ add department" buttonText="+ add department" variant="plain" onOpen={clearCurrent}>
        <ModalBody>{addDepartmentForm}</ModalBody>
      </Modal>
      <List variant="plain">
        {departments.map((relationship, index) => {
          const department = relationship.department;
          return (
            <li key={index}>
              <Row>
                <Col>
                  <h4 className="rvt-text-bold">{department.name}</h4>
                </Col>
                <Col style={{ flexGrow: 0, minWidth: 150, textAlign: "right" }}>
                  <Button variant="plain" type="button" title="Remove Department" onClick={() => confirm(`Are you sure you want to remove ${department.name} as a supported department?`) && removeDepartment(relationship)}>
                    <TrashCan />
                  </Button>
                </Col>
              </Row>
              {relationship.supportType && (
                <Row>
                  <Col>
                    <div style={{ fontSize: "smaller" }}>({relationship.supportType?.name})</div>
                  </Col>
                </Row>
              )}
              {department.description && (
                <Row>
                  <Col>{department.description}</Col>
                </Row>
              )}
            </li>
          );
        })}
      </List>
    </>
  );
};

let UpdateDepartmentsForm: any = reduxForm<IFormProps>({
  form: "updateUnitDepartments",
  enableReinitialize: true
})(form);

UpdateDepartmentsForm = connect(
  (state: IApplicationState) => {
    const filtered = state.lookup.current;
    return { filtered };
  },
  (dispatch: Dispatch): IDispatchProps => {
    return {
      lookupDepartment: (q: string) => {
        return dispatch(lookupDepartment(q));
      },
      clearCurrent: () => dispatch(clearCurrent()),
      closeModal: () => dispatch(closeModal()),
      addDepartment: department => dispatch(saveUnitDepartment(department)),
      removeDepartment: department => dispatch(deleteUnitDepartment(department))
    };
  }
)(UpdateDepartmentsForm);

export default UpdateDepartmentsForm;
