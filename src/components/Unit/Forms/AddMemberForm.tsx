import * as React from "react";
import { reduxForm, InjectedFormProps, change, formValueSelector, Field } from "redux-form";
import { Button } from "rivet-react";
import { RivetInputField, RivetInput, RivetSelect, RivetSelectField, RivetCheckboxField, RivetCheckbox } from "src/components/form";
import { connect } from "react-redux";
import { IApplicationState } from "src/components/types";
import { UitsRole, lookupUser, IUnitMember, IUnitMemberRequest } from "../store";
import { Dispatch } from "redux";
import { IUser } from "src/components/Profile/store";

interface IFormProps extends InjectedFormProps<IUnitMemberRequest>, IUnitMember, IDispatchProps, IStateProps {}

interface IDispatchProps {
  lookupUser: typeof lookupUser;
  setPerson(person: IUser): any;
}
interface IStateProps {
  filteredUsers?: IUser[];
}

const form: React.SFC<IFormProps> = props => {
  const handleSearch = (e: any) => {
    const q = e.target.value;
    props.lookupUser(q);
  };
  const { person, filteredUsers, lookupUser, setPerson, reset, invalid, handleSubmit } = props;
  const hasUser = !!person;
  return (
    <>
      {!hasUser && (
        <>
          <div>
            <RivetInputField name="search" component={RivetInput} label="Search" onChange={handleSearch} onLoad={handleSearch} />
          </div>
          {filteredUsers && filteredUsers.length > 0 && (
            <div className="rvt-dropdown__menu" style={{ position: "relative", padding: 0 }}>
              {filteredUsers.map((user: any, i: number) => {
                // todo: check if relationship already exists
                return (
                  <div key={i}>
                    <Button
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        lookupUser("");
                        setPerson(user);
                      }}
                    >
                      {user && user.name}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {hasUser && (
        <form onSubmit={handleSubmit}>
          <Field name="unitId" component="input" type="hidden" />
          <div className="rvt-ts-23 rvt-text-bold">{person ? person.name : "vacant"}</div>
          <div>
            <RivetSelectField name="role" component={RivetSelect} label="Role">
              <option value={UitsRole.Member}>Member</option>
              <option value={UitsRole.Leader}>Leader</option>
              <option value={UitsRole.Sublead}>Sublead</option>
              <option value={UitsRole.Related}>Related</option>
            </RivetSelectField>
          </div>
          <div>
            <RivetInputField name="title" component={RivetInput} label="Title" />
            <label>
              <p>Display title in orgchart?</p>
              <RivetCheckboxField name="showTitle" component={RivetCheckbox} label="Yes" />
            </label>
          </div>
          <div>
            <RivetInputField name="percentage" component={RivetInput} label="Percentage" type="number" min="0" max="100" />
            <label>
              <p>Display percentage in orgchart?</p>
              <RivetCheckboxField name="showPercentage" component={RivetCheckbox} label="Yes" />
            </label>
          </div>
          <div>
            <Button type="submit" disabled={invalid && hasUser}>
              Add member
            </Button>
            <Button type="button" variant="plain" onClick={reset}>
              Reset
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

let AddMemberForm: any = reduxForm<IUnitMember>({
  form: "addMemberForm",
  enableReinitialize: true
})(form);

// Decorate with connect to read form values
const selector = formValueSelector("addMemberForm"); // <-- same as form name
AddMemberForm = connect(
  (state: IApplicationState) => {
    const filteredUsers = state.lookup.current;
    const person = selector(state, "person");
    return { filteredUsers, person };
  },
  (dispatch: Dispatch) => {
    return {
      lookupUser: (q: string) => dispatch(lookupUser(q)),
      setPerson: (person: IUser) => {
        dispatch(change("addMemberForm", "id", undefined));
        dispatch(change("addMemberForm", "person", person));
        dispatch(change("addMemberForm", "personId", person.id));
      }
    };
  }
)(AddMemberForm);

export default AddMemberForm;
