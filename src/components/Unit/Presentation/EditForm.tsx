import * as React from 'react';
import { reduxForm, InjectedFormProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import * as unit from '../store';
import { Breadcrumbs, Content, PageTitle } from 'src/components/layout';
import { Section, Input, Textarea } from 'rivet-react';
import { TextProps } from 'rivet-react/build/dist/components/Input/common';

const RivetInputField = Field as new () => GenericField<React.InputHTMLAttributes<HTMLInputElement> & TextProps>;
const RivetInput: React.SFC<WrappedFieldProps & React.InputHTMLAttributes<HTMLInputElement> & TextProps> = props =>
    <Input type="text" label={props.label} variant={props.variant} defaultValue={props.defaultValue} />;

const RivetTextareaField = Field as new () => GenericField<React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps>;
const RivetTextarea: React.SFC<WrappedFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps> = props =>
    <Textarea label="foo" />;

interface IFormData extends unit.IWebEntity { }

interface IOwnProps {
    save: typeof unit.saveRequest;
    cancel: typeof unit.cancel;
}


interface IFormProps extends
    IFormData, IOwnProps, InjectedFormProps<IFormData, IOwnProps> { }

const EditForm: React.SFC<IFormProps> = props => {


    return <>
        <Breadcrumbs
            crumbs={[
                { text: "Home", href: "/" },
                { text: "Units", href: "/units" },
                props.name
            ]}
        />
        <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl" >
            <PageTitle>Edit</PageTitle>

            <Section>
                <form onSubmit={props.handleSubmit}>
                    {props.description && (
                        <div className="group-describer rvt-m-bottom-md">
                            <span>{props.description}</span>
                        </div>
                    )}
                    <div>
                        <RivetTextareaField name="description" value="foo" label="Description" component={RivetTextarea} defaultValue="existing description" />
                    </div>
                    <div>
                        <RivetInputField name="rivet" value="bar" label="URL" note="this is a note" variant="info" component={RivetInput} defaultValue="http://example.com"  />
                    </div>
                    <div>
                        <Field name="test" value="test" component={ (props:any) => {console.log(props); return <input type="text"/>; }} />
                    </div>
                    <div>
                        <Field name="test2" value="test2" component="input" />
                    </div>
                    <div>
                        <div>
                            <button onClick={props.cancel}>Cancel</button>
                        </div>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </Section>
        </Content>
    </>
}
export default reduxForm<IFormData, IOwnProps>({
    // a unique name for the form
    form: 'editUnit'
})(EditForm)