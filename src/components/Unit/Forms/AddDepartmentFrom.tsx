import * as React from 'react';
import { reduxForm, InjectedFormProps, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Button } from 'rivet-react';
import { RivetInputField, RivetInput, required } from '../../form';
import { IApplicationState } from '../../types';

interface IFormProps extends InjectedFormProps<any>, IFields {
    onSubmit: (fields: IFields) => any
}
interface IFields {
    id: string | number;
}

const addDepartmentForm: React.SFC<IFormProps> = props => {
    return <>
        <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onSubmit && props.onSubmit({
                id: props.id
            })
            props.reset();
        }}>
            <div>
                <RivetInputField name="id" component={RivetInput} label="id" validate={[required]} />
            </div>
            <div>
                <Button type="submit" disabled={props.invalid}>Save</Button>
            </div>
        </form>
    </>;
}

let AddDepartmentForm: any = reduxForm<IFormProps>({
    form: "addUnitDepartment",
    enableReinitialize: true
})(addDepartmentForm);


const selector = formValueSelector('addUnitDepartment') 
AddDepartmentForm = connect(
    (state: IApplicationState) => {
        const id = selector(state, "id")
        return { id }
    }
)(AddDepartmentForm)

export default AddDepartmentForm;