import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import './FormTextFieldInput.styles.css';

function FormTextFieldInput(props) {
  const { control } = useFormContext();
  const {
    name, label, required, errorobj,
  } = props;
  let isError = false;
  let errorMessage = '';
  if (errorobj && errorobj.hasOwnProperty(name)) {
    isError = true;
    errorMessage = errorobj[name].message;
  }

  return (
    <Controller
      as={TextField}
      name={name}
      control={control}
      defaultValue=""
      label={label}
      fullWidth
      InputLabelProps={{
        className: required ? 'required-label' : '',
        required: required || false,
      }}
      error={isError}
      helperText={errorMessage}
      {...props}
    />
  );
}

export default FormTextFieldInput;
