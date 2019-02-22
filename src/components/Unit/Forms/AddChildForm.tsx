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
  onSubmit(): any;
  units: IEntity[];
  unitId?: number;
  filteredUnits: IEntity[];
}

const Component: React.SFC<IFormProps> = ({ filteredUnits, addChild, lookupUnit, unitId, onSubmit }) => (
  <>
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
      />
    </div>
    {filteredUnits && filteredUnits.length > 0 && (
      <div className="rvt-dropdown__menu" style={{ position: "relative", padding: 0 }}>
        {filteredUnits.map((unit: any, i: number) => {
          return (
            <div key={i}>
              <Button
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  addChild({ ...unit, parentId: unitId });
                  lookupUnit("");
                  onSubmit();
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
  </>
);

const AddChildForm: any = reduxForm<IFormProps>({
  form: "addUnitChildren",
  enableReinitialize: true
})(
  connect(
    (state: IApplicationState) => {
      const id = selector(state, "id");
      const filteredUnits = state.lookup.current;
      const unitId = state.unit.profile.data && state.unit.profile.data.id;
      return { id, filteredUnits, unitId };
    },
    (dispatch: Dispatch): IDispathProps => ({
      lookupUnit: (q: string) => dispatch(lookupUnit(q)),
      addChild: unit => dispatch(saveUnitChild(unit))
    })
  )(Component)
);

const selector = formValueSelector("addUnitChildren");

export default AddChildForm;
