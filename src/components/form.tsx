import * as React from "react";
import { WrappedFieldMetaProps, Field, WrappedFieldProps, GenericField } from "redux-form";
import { TextProps } from "rivet-react/build/dist/components/Input/common";
import { Input, Textarea } from "rivet-react";

// Validation
export const required = (value: any) => value ? undefined : "This field is required.";

const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

export const url = (str: string) =>
    urlregex.test(str.trim()) ? undefined : "Please enter a valid URL (ex: https://domain.iu.edu).";


// Helpers

const resolveVariant = (meta: WrappedFieldMetaProps) =>
    meta.pristine
        ? undefined
        : meta.error ? "invalid" : meta.warning ? "warning" : "valid"

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
      {...props.input} />;

export const RivetTextareaField = Field as new () => GenericField<React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps>;
export const RivetTextarea: React.SFC<WrappedFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps> = props => 
    <Textarea 
    label={props.label} 
    variant={resolveVariant(props.meta)} 
    note={resolveNote(props.meta)} 
    {...props.input} />;