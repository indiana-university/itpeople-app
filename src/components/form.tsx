import * as React from "react";
import { WrappedFieldMetaProps, Field, WrappedFieldProps, GenericField } from "redux-form";
import { TextProps } from "rivet-react/build/dist/components/Input/common";
import { Input, Textarea, Select, Checkbox } from "rivet-react";

// Validation
export const required = (value: any) => value ? undefined : "This field is required.";

const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
const emailregex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export const url = (str: string) =>
    (!str || urlregex.test(str.trim())) ? undefined : "Please enter a valid URL (ex: https://domain.iu.edu).";
export const email = (str: string) =>
    (!str || emailregex.test(str.trim())) ? undefined : "Please enter a valid email address (ex: person@iu.edu).";


// Helpers

const resolveVariant = (meta: WrappedFieldMetaProps) =>
    meta.pristine
        ? undefined
        : meta.error ? "danger" : meta.warning ? "warning" : "success"

const resolveNote = (meta: WrappedFieldMetaProps) =>
    meta.pristine
        ? undefined
        : meta.error || meta.warning || undefined


// Fields

export const RivetInputField = Field as new () => GenericField<React.InputHTMLAttributes<HTMLInputElement> & TextProps>;
export const RivetInput: React.SFC<WrappedFieldProps & React.InputHTMLAttributes<HTMLInputElement> & TextProps> = props =>
    <Input
        type="text"
        label={props.label}
        variant={resolveVariant(props.meta)}
        note={resolveNote(props.meta)}
        margin={{ bottom: 'sm' }}
        {...props.input}
        {...props} />;

export const RivetTextareaField = Field as new () => GenericField<React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps>;
export const RivetTextarea: React.SFC<WrappedFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps> = props =>
    <Textarea
        label={props.label}
        variant={resolveVariant(props.meta)}
        note={resolveNote(props.meta)}
        margin={{ bottom: 'sm' }}
        {...props.input} />;
        // React.StatelessComponent<TextProps & React.SelectHTMLAttributes<HTMLSelectElement> & Rivet.Props>;   
export const RivetSelectField = Field as new () => GenericField<React.SelectHTMLAttributes<HTMLSelectElement> & TextProps>;
export const RivetSelect: React.SFC<WrappedFieldProps & React.SelectHTMLAttributes<HTMLSelectElement> & TextProps> = props =>
    <Select
        label={props.label}
        variant={resolveVariant(props.meta)}
        note={resolveNote(props.meta)}
        {...props.input} >
        {props.children}
        </Select>

export const RivetCheckboxField = Field as new () => GenericField<React.InputHTMLAttributes<HTMLInputElement> & TextProps>;
export const RivetCheckbox: React.SFC<WrappedFieldProps & React.InputHTMLAttributes<HTMLInputElement> & TextProps> = props =>
    <Checkbox
        checked={props.input.value}
        {...props.input}
        {...props} />;