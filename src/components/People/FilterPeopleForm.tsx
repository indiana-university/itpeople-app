import * as React from "react";
import { reduxForm, InjectedFormProps, WrappedFieldProps, Field, WrappedFieldArrayProps, FieldArray } from "redux-form";
import * as people from "./store";
import { Button, List } from "rivet-react";
import { RivetCheckboxField, RivetCheckbox } from "src/components/form";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IPeopleRequest, JobClassDisplayNames, JobClassList, CampusList, CampusDisplayNames, RoleList } from "src/components/types";

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
      roles: setOf(selected, "role_")
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

  return (
    <form onSubmit={handleSubmit(doHandle)} >
      <h2 className="rvt-ts-23 rvt-text-bold" style={h2_first}>Unit Role</h2>
      <FieldArray name="role" component={renderRoles} />
      <h2 className="rvt-ts-23 rvt-text-bold" style={h2}>Job Class</h2>
      <FieldArray name="responsibilities" component={renderJobClasses} />
      <h2 className="rvt-ts-23 rvt-text-bold" style={h2}>Campus</h2>
      <FieldArray name="campuses" component={renderCampuses} />
      <Button type="submit" style={submit}>Apply Filters</Button>
    </form>
  );
};

const renderRoles: any = (props: WrappedFieldArrayProps<string>) =>
  <List variant="plain" padding={{ left: "md", right: "md" }} >
    {RoleList
      .filter(name => name != "None")
      .map((name, i: number) => (
        <li key={name + i}>
          <Field name={name} component={renderRole} />
        </li>
      ))}
  </List>

const renderJobClasses: any = (props: WrappedFieldArrayProps<string>) =>
    <List variant="plain" padding={{ left: "md", right:"md" }} >
      {JobClassList
        .filter(name => name != "None")
        .map((name, i: number) => (
        <li key={name + i}>
          <Field name={name} component={renderJobClass} />
        </li>
      ))}
    </List>

const renderCampuses: any = (props: WrappedFieldArrayProps<string>) =>
  <List variant="plain" padding={{ left: "md", right: "md" }} >
    {CampusList
      .map((name, i: number) => (
        <li key={name + i}>
          <Field name={name} component={renderCampus} />
        </li>
      ))}
  </List>


const renderRole = ({ input: { name, value: { name: jobClass } } }: WrappedFieldProps) =>
  <RivetCheckboxField name={"role_" + name} component={RivetCheckbox} value={name} label={name} />

const renderCampus = ({ input: { name, value: { name: jobClass } } }: WrappedFieldProps) =>
  <RivetCheckboxField name={"campus_"+name} component={RivetCheckbox} value={name} label={CampusDisplayNames[name]} />

const renderJobClass = ({ input: { name, value: { name: jobClass } } }: WrappedFieldProps) =>
  <RivetCheckboxField name={"class_"+name} component={RivetCheckbox} value={name} label={JobClassDisplayNames[name]} />

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