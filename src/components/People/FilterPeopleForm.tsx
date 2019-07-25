import * as React from "react";
import { reduxForm, InjectedFormProps, WrappedFieldProps, Field, WrappedFieldArrayProps, FieldArray } from "redux-form";
import * as people from "./store";
import { Button, List } from "rivet-react";
import { RivetCheckboxField, RivetCheckbox } from "src/components/form";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IPeopleRequest, JobClassDisplayNames, JobClassList } from "src/components/types";
import { closeModal } from "../layout/Modal";

interface IDispatchActions {
  filter: typeof people.fetchPeople;
}

interface IFormProps extends IPeopleRequest, IDispatchActions, InjectedFormProps<IPeopleRequest, IDispatchActions> { }

let FilterPeopleForm: React.SFC<IFormProps> | any = ({ filter, handleSubmit }: IFormProps) => {
  const doHandle = (values: IPeopleRequest) => {
    filter(values);
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit(doHandle)} >
      <FieldArray name="responsibilities" component={renderJobClass} />
      <Button type="submit">Update</Button>
    </form>
  );
};

const renderJobClass: any = (props: WrappedFieldArrayProps<string>) =>
  <List variant="plain" padding={{ left: "md" }}>
    {JobClassList.map((name, i: number) => (
      <li key={name + i}>
        <Field name={name} component={renderTool} />
      </li>
    ))}
  </List>

const renderTool = ({ input: { name, value: { name: jobClass } } }: WrappedFieldProps) =>
  <RivetCheckboxField name={name + "enabled"} component={RivetCheckbox} label={JobClassDisplayNames[jobClass] || jobClass} />



FilterPeopleForm = reduxForm<IPeopleRequest, IDispatchActions>({
  form: "filterPeopleForm",
  enableReinitialize: true
})(FilterPeopleForm);

FilterPeopleForm = connect(
  undefined,
  (dispatch: Dispatch): IDispatchActions => ({
    filter: (req: IPeopleRequest) => dispatch(people.fetchPeople(req))
  })
)(FilterPeopleForm);

export default FilterPeopleForm;