import * as React from 'react';
import { reduxForm, InjectedFormProps, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Button } from 'rivet-react';
import { RivetInputField, RivetInput, required } from '../../form';
import { IApplicationState } from '../../types';
import { Dispatch } from 'redux';
import { lookupUnit } from '../store';


interface IFormProps extends InjectedFormProps<any>, IFields, IDispathProps, IProps {
    onSubmit: (fields: IFields) => any
}
interface IFields {
    id: string | number;
}
interface IDispathProps {
    lookupUnit: typeof lookupUnit
}
interface IProps{
    units: any
}

const updateParentForm: React.SFC<IFormProps> = props => {
    return <>
        <form>
            <div>
                <RivetInputField name="q" component={RivetInput} label="Search" validate={[required]}
                    onChange={(e: any) => {
                        const q = e.target.value;
                        props.lookupUnit(q)
                    }}
                    onLoad={(e: any) => {
                        const q = e.target.value;
                        props.lookupUnit(q)
                    }}
                />
            </div>
            <div>
                {props.units &&
                    props.units.map((unit:any, i:number) =>{
                        // todo: circular reference check
                        return <div key={i}>
                            <h2>{unit && unit.name}</h2>
                            <div>{unit && unit.description}</div>
                            <Button type="button" onClick={(e)=>{
                                 e.preventDefault();
                                 e.stopPropagation();
                                 props.onSubmit(unit)
                                 props.reset();
                                 props.lookupUnit("");
                            }}>Select {unit && unit.name}</Button>
                        </div>
                    })
                }
            </div>
        </form>
    </>;
}

let UpdateParentForm: any = reduxForm<IFormProps>({
    form: "updateUnitParent",
    enableReinitialize: true
})(updateParentForm);

const selector = formValueSelector('updateUnitParent')
UpdateParentForm = connect(
    (state: IApplicationState) => {
        const id = selector(state, "id")
        const units = state.lookup.current
        return { id, units }
    },
    ((dispatch: Dispatch): IDispathProps => ({
        lookupUnit: (q: string) => dispatch(lookupUnit(q))
    }))
)(UpdateParentForm)

export default UpdateParentForm;