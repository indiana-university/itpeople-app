import * as React from "react";
import { reduxForm, InjectedFormProps, WrappedFieldProps, Field, WrappedFieldArrayProps, FieldArray } from "redux-form";
import * as people from "./store";
import { Button, List } from "rivet-react";
import { RivetCheckboxField, RivetCheckbox } from "src/components/form";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IPeopleRequest, JobClassDisplayNames, CampusDisplayNames, AreaDisplayNames, RoleDisplayNames } from "src/components/types";
import _ = require("lodash");

interface IDispatchActions {
  filter: typeof people.fetchPeople;
}

interface IFormProps extends IPeopleRequest, IDispatchActions, InjectedFormProps<IPeopleRequest, IDispatchActions> { }

let FilterPeopleForm: React.SFC<IFormProps> | any = ({ filter, handleSubmit }: IFormProps) => {
  const setOf = (vals:string[], prefix:string) =>
    vals
    .filter(k => k.startsWith(prefix))
    .map(k => k.replace(prefix, ""));

  const doHandle = (values: object) => {
    let selected = 
      Object.entries(values)
            .filter(([k, v]) => v)
            .map(a => a[0]);
    let req = { 
      classes: setOf(selected, "class_"), 
      campuses: setOf(selected, "campus_"),
      roles: setOf(selected, "role_"),
      areas: setOf(selected, "area_")
    };
    filter(req);
  };

  const h2_first = {
    marginBottom: '1rem'
  }
  const h2 = {
    marginTop: '2rem',
    marginBottom: '1rem'
  }
  const submit = {
    marginTop: '2rem'
  }
  const filteredJobClasses = _.omit(JobClassDisplayNames, "None");

  return (
    <form onSubmit={handleSubmit(doHandle)} >
      <h2 className="rvt-ts-23 rvt-text-bold" style={h2_first}>Unit Role</h2>
      <FieldArray name="role" component={renderFieldList("role", RoleDisplayNames)} />
      <h2 className="rvt-ts-23 rvt-text-bold" style={h2}>Responsibility</h2>
      <FieldArray name="responsibilities" component={renderFieldList("class", filteredJobClasses)} />
      <h2 className="rvt-ts-23 rvt-text-bold" style={h2}>Campus</h2>
      <FieldArray name="campuses" component={renderFieldList("campus", CampusDisplayNames)} />
      <h2 className="rvt-ts-23 rvt-text-bold" style={h2}>Area</h2>
      <FieldArray name="areas" component={renderFieldList("area", AreaDisplayNames)} />
      <Button type="submit" style={submit}>Apply Filters</Button>
    </form>
  );
};

const renderFieldList: any = (field:string, options:object) =>
  (props: WrappedFieldArrayProps<string>) =>
    <List variant="plain" padding={{ left: "md", right: "md" }} >
      {Object
        .keys(options)
        .map((name, i: number) => (
          <li key={name + i}>
            <Field name={name} component={renderField(field, options)} />
          </li>
        ))}
    </List>

const renderField = (field:string, options:object) =>
  ({ input: { name, value: { name: jobClass } } }: WrappedFieldProps) =>
    <RivetCheckboxField name={`${field}_${name}`} component={RivetCheckbox} value={name} label={options[name]} />

FilterPeopleForm = reduxForm<IPeopleRequest, IDispatchActions>({
  form: "filterPeopleForm",
  enableReinitialize: true,
  destroyOnUnmount: false
})(FilterPeopleForm);

FilterPeopleForm = connect(
  undefined,
  (dispatch: Dispatch): IDispatchActions => ({
    filter: (req: IPeopleRequest) => {
      console.log("*** dispatch", req)
      return dispatch(people.fetchPeople(req));
    }
  })
)(FilterPeopleForm);

export default FilterPeopleForm;