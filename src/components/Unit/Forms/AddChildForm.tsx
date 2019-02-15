import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Button } from "rivet-react";
import { RivetInputField, RivetInput, required } from "../../form";
import { IApplicationState, IEntity, IUnit } from "../../types";
import { lookupUnit } from "..";
import { Dispatch } from "redux";
import { saveUnitChild } from "../store";

interface IFormProps extends InjectedFormProps<any>, IUnit, IDispathProps, IProps {}

interface IDispathProps {
  lookupUnit: typeof lookupUnit;
  addChild: typeof saveUnitChild;
}

interface IProps {
  units: IEntity[];
  unitId: number;
  filteredUnits: IEntity[];
}

const Component: React.SFC<IFormProps> = props => {
  const { filteredUnits, addChild, lookupUnit, unitId, reset } = props;
  // set state
  return (
    <form>
      <div>
        <RivetInputField
          name="q"
          component={RivetInput}
          label="Search"
          validate={[required]}
          onChange={(e: any) => {
            const q = e.target.value;
            lookupUnit(q);
          }}
          onLoad={(e: any) => {
            const q = e.target.value;
            lookupUnit(q);
          }}
        />
      </div>
      {filteredUnits && filteredUnits.length > 0 && (
        <div className="rvt-dropdown__menu" style={{ position: "relative", padding: 0 }}>
          {filteredUnits.map((unit: any, i: number) => {
            return (
              <div key={i}>
                <Button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    addChild({ ...unit, parentId: unitId });
                    reset();
                    lookupUnit("");
                  }}
                  disabled={!!unit.parentId} // disable if unit has parent
                >
                  {/* if no parent, just the unit name. If parent, unit name + "unit name (assigned to parent name)" */}
                  {unit && unit.name}
                  {unit.parentId && <> (assigned to {unit.parent ? unit.parent.name : "another unit"})</>}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </form>
  );
};

let form: any = reduxForm<IFormProps>({
  form: "addUnitChildren",
  enableReinitialize: true
})(Component);

const selector = formValueSelector("addUnitChildren");
const AddChildForm = connect(
  (state: IApplicationState) => {
    const id = selector(state, "id");
    const filteredUnits = state.lookup.current;
    return { id, filteredUnits };
  },
  (dispatch: Dispatch): IDispathProps => ({
    lookupUnit: (q: string) => dispatch(lookupUnit(q)),
    addChild: unit => dispatch(saveUnitChild(unit))
  })
)(form);

export default AddChildForm;
