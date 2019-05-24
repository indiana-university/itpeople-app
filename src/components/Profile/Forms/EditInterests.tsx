import * as React from "react";
import { reduxForm, InjectedFormProps } from "redux-form";
import { connect } from "react-redux";
import { Button, Badge, List } from "rivet-react";
import { RivetInputField, RivetInput, required } from "../../form";
import { IApplicationState, IUnit, IPerson } from "../../types";
import { Dispatch } from "redux";
import { TrashCan } from "src/components/icons";
import { lookupTag } from "../store";

const Component: React.SFC<IFormProps> = ({ interests, onSubmit, tags, lookupTags }) => (
  <>
    <List orientation="inline">
      {interests && interests.map((i) => (
        <Badge key={i + "-interest"}>
          {i}
          <Button
            variant="plain"
            padding="xxs"
            style={{ height: "auto" }}
            title="remove"
            onClick={() => onSubmit(interests.filter(x => x != i))}><TrashCan />
          </Button>
        </Badge>))}
    </List>
    <div>
      <RivetInputField
        name="q"
        component={RivetInput}
        label="Search"
        validate={[required]}
        onChange={(e: any) => {
          const q = (e.target.value + "").toLowerCase();
          lookupTags(q);
        }}
      />
    </div>
    {tags && tags.length > 0 && (
      <div className="rvt-dropdown__menu" style={{ position: "relative", padding: 0 }}>
        {tags.map((tag, i: number) => {
          return (
            <div key={`${tag}(${i})`}>
              <Button
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSubmit([...interests, tag])
                }}>
                {tag}
              </Button>
            </div>
          );
        })}
      </div>
    )}
  </>
);

interface IFormProps extends InjectedFormProps<any>, IUnit, IProps, IDispatchProps {
  interests: string[];
  person: IPerson;
}

interface IProps {
  onSubmit(intertest: string[]): any;
  tags: string[]
}
interface IDispatchProps {
  lookupTags(q: string): any;
}

const EditInterests: any = reduxForm<IFormProps>({
  form: "editInterests",
  enableReinitialize: true
})(
  connect(
    (state: IApplicationState) => {
      const tags = state.profile.tags || [];
      return { tags };
    },
    (dispatch: Dispatch) => ({
      lookupTags: (q: string) => dispatch(lookupTag(q)),
    })
  )(Component)
);

// const selector = formValueSelector("addUnitChildren");

export default EditInterests;
