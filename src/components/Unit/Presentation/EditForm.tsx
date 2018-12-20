import * as React from 'react';
import { reduxForm, InjectedFormProps, Field, GenericField, WrappedFieldProps, WrappedFieldMetaProps } from 'redux-form';
import * as unit from '../store';
import { Breadcrumbs, Content, PageTitle } from 'src/components/layout';
import { Section, Input, Textarea } from 'rivet-react';
import { TextProps } from 'rivet-react/build/dist/components/Input/common';

// Validation
const required = (value:any) => value ? undefined : "This field is required.";

var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

const validURL = (str: string) =>
  urlregex.test(str.trim()) ? undefined : "Please enter a valid URL (ex: https://domain.iu.edu).";

const resolveVariant = (meta:WrappedFieldMetaProps) =>
    meta.pristine
    ? undefined
    : meta.error ? "invalid" : meta.warning ? "warning" : "valid" 

const resolveNote = (meta: WrappedFieldMetaProps) => 
    meta.pristine
    ? undefined
    : meta.error || meta.warning || undefined
    
const RivetInputField = Field as new () => GenericField<React.InputHTMLAttributes<HTMLInputElement> & TextProps>;
const RivetInput: React.SFC<WrappedFieldProps & React.InputHTMLAttributes<HTMLInputElement> & TextProps> = props => {
    return <Input 
        type="text" 
        label={props.label} 
        variant={resolveVariant(props.meta)} 
        note={resolveNote(props.meta)} 
        {...props.input } />;  
}

const RivetTextareaField = Field as new () => GenericField<React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps>;
const RivetTextarea: React.SFC<WrappedFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps> = props => {
    return <Textarea 
        label={props.label}
        variant={resolveVariant(props.meta)}
        note={resolveNote(props.meta)}
        {...props.input } />;  
}

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
                        <RivetInputField name="url" component={RivetInput} label="URL" validate={[validURL]}/>
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

