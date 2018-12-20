import * as React from 'react';
import { reduxForm, InjectedFormProps } from 'redux-form';
import * as unit from '../store';
import { Breadcrumbs, Content, PageTitle } from 'src/components/layout';
import { Section } from 'rivet-react';
import { RivetInputField, RivetInput, RivetTextarea, RivetTextareaField, required, url } from 'src/components/form';

interface IFormActions {
    save: typeof unit.saveRequest;
    cancel: typeof unit.cancel;
}

interface IFormProps extends
    unit.IUnitProfile, IFormActions, InjectedFormProps<unit.IUnitProfile, IFormActions> { }

const EditForm: React.SFC<IFormProps> = props => 
    <>
        <Breadcrumbs 
            crumbs={[
                { text: "Home", href: "/" },
                { text: "Units", href: "/units" },
                props.name
            ]} />
        <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl" >
            <PageTitle>Edit Unit</PageTitle>
            <Section>
                <form onSubmit={props.save}>
                    <div>
                        <RivetInputField name="name" component={RivetInput} label="Name" validate={[required]} />
                    </div>
                    <div>
                        <RivetTextareaField name="description" component={RivetTextarea} label="Description" validate={[required]}/>
                    </div>
                    <div>
                        <RivetInputField name="url" component={RivetInput} label="URL" validate={[url]}/>
                    </div>
                    <div>
                        <button onClick={props.cancel}>Cancel</button>
                        <button type="submit" disabled={props.invalid}>Save</button>
                    </div>
                </form>
            </Section>
        </Content>
    </>;

export default reduxForm<unit.IUnitProfile, IFormActions>({
  form: "editUnit",
  enableReinitialize: true
})(EditForm);

