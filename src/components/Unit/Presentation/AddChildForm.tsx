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

const addChildForm: React.SFC<IFormProps> = props => {
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

let AddChildForm: any = reduxForm<IFormProps>({
    form: "addUnitChild",
    enableReinitialize: true
})(addChildForm);


const selector = formValueSelector('addUnitChild') 
AddChildForm = connect(
    (state: IApplicationState) => {
        const id = selector(state, "id")
        return { id }
    }
)(AddChildForm)

export default AddChildForm;