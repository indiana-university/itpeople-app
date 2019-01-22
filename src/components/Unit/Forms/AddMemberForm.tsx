import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { Button } from "rivet-react";
import {
  RivetInputField,
  RivetInput,
  RivetSelect,
  RivetSelectField
} from "src/components/form";
import { connect } from "react-redux";
import { IApplicationState } from "src/components/types";
import { UitsRole, ItProRole, lookupUser } from "../store";
import { Dispatch } from "redux";
import { IUser } from "src/components/Profile/store";

interface IFormProps
  extends InjectedFormProps<any>,
    IMemberFields,
    IDispatchProps,
    IStateProps {
  onSubmit: (e?: any) => any;
}
interface IMemberFields {
  id: number;
  name: string;
  title: string;
  role: UitsRole | ItProRole;
}
interface IDispatchProps {
  lookupUser: typeof lookupUser;
}
interface IStateProps {
  users?: IUser[];
}

const AddMemberForm: React.SFC<IFormProps> = props => {
  const handleSearch = (e: any) => {
    const q = e.target.value;
    props.lookupUser(q);
  };
  const { id, name, title, role, users, lookupUser, change, invalid } = props;
  const hasUser = !!id;
  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          props.onSubmit({id, name, title, role });
          props.reset();
        }}
      >
        {!hasUser && (
          <>
            <div>
              <RivetInputField
                name="search"
                component={RivetInput}
                label="Search"
                onChange={handleSearch}
                onLoad={handleSearch}
              />
            </div>
            {users && users.length > 0 && (
              <div
                className="rvt-dropdown__menu"
                style={{ position: "relative", padding: 0 }}
              >
                {users.map((user: any, i: number) => {
                  // todo: circular reference check
                  // todo: check if relationship already exists
                  return (
                    <div key={i}>
                      <Button
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          lookupUser("");
                          change("name", user.name);
                          change("id", user.id);
                          change("search", "");
                          // todo: set selecdted user
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
          <>
            <div className="rvt-ts-23 rvt-text-bold">{name}</div>
            <hr />
            <div>
              <RivetInputField
                name="title"
                component={RivetInput}
                label="Title"
              />
            </div>
            <div>
              <RivetSelectField
                name="role"
                component={RivetSelect}
                label="Role"
              >
                <option value={UitsRole.Member}>Member</option>
                <option value={UitsRole.Leader}>Leader</option>
                <option value={UitsRole.Sublead}>Sublead</option>
                <option value={UitsRole.Related}>Related</option>
              </RivetSelectField>
            </div>
            <hr />
            <div>
              <Button type="submit" disabled={invalid && hasUser}>
                Add member
              </Button>
              <Button
                type="button"
                variant="plain"
                onClick={() => {
                  change("name", null);
                  change("id", null);
                }}
              >
                Reset
              </Button>
            </div>
          </>
        )}
      </form>
    </>
  );
};

let addMemberForm: any = reduxForm<IFormProps>({
  form: "addMemberForm",
  enableReinitialize: true
})(AddMemberForm);

// Decorate with connect to read form values
const selector = formValueSelector("addMemberForm"); // <-- same as form name
addMemberForm = connect(
  (state: IApplicationState) => {
    const id = selector(state, "id");
    const name = selector(state, "name");
    const title = selector(state, "title");
    const role = selector(state, "role");
    const users = state.lookup.current;
    return { id, name, title, role, users };
  },
  (dispatch: Dispatch) => {
    return {
      lookupUser: (q: string) => dispatch(lookupUser(q))
    };
  }
)(addMemberForm);

export default addMemberForm;
