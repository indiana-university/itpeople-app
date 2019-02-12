import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Button } from "rivet-react";
import { RivetInputField, RivetInput } from "../../form";
import { IApplicationState } from "../../types";
import { Dispatch } from "redux";
import { lookupDepartment } from "..";

interface IFormProps
  extends InjectedFormProps<any>,
    IFields,
    IDispatchProps,
    IProps {
  onSubmit: (fields: IFields) => any;
}
interface IFields {
  id: string | number;
}
interface IDispatchProps {
  lookupDepartment: typeof lookupDepartment;
}
interface IProps {
  departments: any;
}
const addDepartmentForm: React.SFC<IFormProps> = props => {
  const handleChange = (e: any) => {
    const q = e.target.value;
    props.lookupDepartment(q);
  };
  return (
    <>
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

        {props.departments && props.departments.length > 0 && (
          <div
            className="rvt-dropdown__menu"
            style={{ position: "relative", padding: 0 }}
          >
            {props.departments.map((unit: any, i: number) => {
              // todo: circular reference check
              // todo: check if relationship already exists
              return (
                <div key={i}>
                  <Button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      props.onSubmit(unit);
                      props.reset();
                      props.lookupDepartment("");
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
};

let AddDepartmentForm: any = reduxForm<IFormProps>({
  form: "addUnitDepartment",
  enableReinitialize: true
})(addDepartmentForm);

const selector = formValueSelector("addUnitDepartment");
AddDepartmentForm = connect(
  (state: IApplicationState) => {
    const id = selector(state, "id");
    const departments = state.lookup.current;
    return { id, departments };
  },
  (dispatch: Dispatch) => {
    return {
      lookupDepartment: (q: string) => {
        dispatch(lookupDepartment(q));
      }
    };
  }
)(AddDepartmentForm);

export default AddDepartmentForm;
