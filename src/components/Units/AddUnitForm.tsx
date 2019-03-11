import * as React from "react";
import { reduxForm, InjectedFormProps } from "redux-form";
import * as unit from "./store";
import { Section, Button } from "rivet-react";
import { RivetInputField, RivetInput, RivetTextarea, RivetTextareaField, required, url } from "src/components/form";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IUnit } from "src/components/types";

interface IDispatchActions {
  save: (unit: any) => any;
}

interface IFormProps extends IUnit, IDispatchActions, InjectedFormProps<IUnit, IDispatchActions> { }

let AddUnitForm: React.SFC<IFormProps> | any = ({ save, handleSubmit }: IFormProps) => {
  const doHandle = (values: IUnit) => {
    save(values);
  };

  return (
    <form onSubmit={handleSubmit(doHandle)} >
      <Section className="rvt-p-bottom-sm">
        <div>
          <RivetInputField name="name" component={RivetInput} label="Name" validate={[required]} />
        </div>
        <div>
          <RivetTextareaField name="description" component={RivetTextarea} label="Description" />
        </div>
        <div>
          <RivetInputField name="url" component={RivetInput} label="URL" validate={[url]} />
        </div>
      </Section>
      <Button>Save</Button>
    </form>
  );
};

AddUnitForm = reduxForm<IUnit, IDispatchActions>({
  form: "addUnitForm",
  enableReinitialize: true
})(AddUnitForm);

AddUnitForm = connect(
  undefined,
  (dispatch: Dispatch): IDispatchActions => ({
    save: (newUnit: IUnit) => dispatch(unit.addUnit(newUnit))
  })
)(AddUnitForm);

export default AddUnitForm;