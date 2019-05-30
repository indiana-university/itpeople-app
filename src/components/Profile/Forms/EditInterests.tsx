import * as React from "react";
import { reduxForm, InjectedFormProps } from "redux-form";
import { connect } from "react-redux";
import { Button, Badge, List } from "rivet-react";
import { RivetInputField, RivetInput, required } from "../../form";
import { IApplicationState, IUnit, IPerson } from "../../types";
import { Dispatch } from "redux";
import { TrashCan } from "src/components/icons";
import { lookupTag } from "../store";
import { debounce } from "lodash";


const Component: React.SFC<IFormProps> = ({ expertise, onSubmit, tags, tagSearch, lookupTags }) => {


  const handleSearch = (e: any) => {
    const q = (e.target.value + "").toLowerCase();
    lookupTags(q);
  };
  const handleSearchDebounced = debounce(handleSearch, 500);

  return (
    <>
      <List orientation="inline">
        {expertise && expertise.map((i) => (
          <Badge key={i + "-interest"}>
            {i}
            <Button
              variant="plain"
              padding="xxs"
              style={{ height: "auto" }}
              title="remove"
              onClick={() => onSubmit(expertise.filter(x => x != i))}><TrashCan />
            </Button>
          </Badge>))}
      </List>
      <div>
        <RivetInputField
          name="q"
          component={RivetInput}
          label="Search"
          validate={[required]}
          onChange={handleSearchDebounced}
        />
      </div>

      {tagSearch &&
        <div className="rvt-dropdown__menu" style={{ position: "relative", padding: 0 }}>
          <div>
            <Button
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                const tag = tagSearch.toLowerCase().replace(/\s+/g, '-').substr(0, 50);
                onSubmit([...expertise, tag])
              }}>
              {tagSearch}
            </Button>
          </div>

          {tags && tags.length > 0 && tags.map((tag, i: number) => {
            return (
              <div key={`${tag}(${i})`}>
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    onSubmit([...expertise, tag])
                  }}>
                  {tag}
                </Button>
              </div>
            );
          })}
        </div>
      }
    </>
  );
}

interface IFormProps extends InjectedFormProps<any>, IUnit, IProps, IDispatchProps {
  expertise: string[];
  person: IPerson;
}

interface IProps {
  onSubmit(intertest: string[]): any;
  tags: string[],
  tagSearch: string
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
      const tagSearch = state.profile.tagSearch || "";
      return { tags, tagSearch };
    },
    (dispatch: Dispatch) => ({
      lookupTags: (q: string) => dispatch(lookupTag(q)),
    })
  )(Component)
);

// const selector = formValueSelector("addUnitChildren");

export default EditInterests;
