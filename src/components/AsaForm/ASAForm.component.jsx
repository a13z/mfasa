import React from 'react';

import { useForm, Controller } from 'react-hook-form';
// import Header from "./Header";
// import ReactDatePicker from "react-datepicker";
// import NumberFormat from "react-number-format";
// import ReactSelect from "react-select";
// import options from "./constants/reactSelectOptions";
import {
  TextField,
  Checkbox,
  Select,
  MenuItem,
  Switch,
  RadioGroup,
  FormControlLabel,
  ThemeProvider,
  Radio,
  createMuiTheme,
  Slider,
} from '@material-ui/core';

// import MuiAutoComplete from "./MuiAutoComplete";
// import "react-datepicker/dist/react-datepicker.css";

// import ButtonsResult from "./ButtonsResult";
// import DonwShift from "./DonwShift";

// import "./ASAForm.style.scss";

function ASAForm() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        placeholder="First Name"
        name="FirstName"
        inputRef={register}
      />
      <input
        type="text"
        placeholder="Asset Name"
        name="Asset Name"
        ref={register({ required: true })}
      />
      <input
        type="text"
        placeholder="Asset Unit"
        name="Asset Unit"
        ref={register({ required: true })}
      />
      <input
        type="number"
        placeholder="Total Supply"
        name="Total Supply"
        ref={register({ required: true })}
      />
      <input
        type="number"
        placeholder="Decimals"
        name="Decimals"
        ref={register({ required: true, min: 0 })}
      />
      <input
        type="url"
        placeholder="Asset Url"
        name="Asset Url"
        ref={register}
      />
      <input
        type="text"
        placeholder="Metadata"
        name="Metadata"
        ref={register({ maxLength: 32 })}
      />
      <input
        type="checkbox"
        placeholder="Frozen by default"
        name="Frozen by default"
        ref={register}
      />
      <input
        type="checkbox"
        placeholder="Default to Sender"
        name="Default to Sender"
        ref={register}
      />
      <input
        type="text"
        placeholder="Manager Address"
        name="Manager Address"
        ref={register({ required: true, maxLength: 52 })}
      />
      <input
        type="text"
        placeholder="Reserve Address"
        name="Reserve Address"
        ref={register({ maxLength: 52 })}
      />
      <input
        type="text"
        placeholder="Freeze Address"
        name="Freeze Address"
        ref={register({ maxLength: 52 })}
      />
      <input
        type="text"
        placeholder="Clawback Address"
        name="Clawback Address"
        ref={register({ maxLength: 52 })}
      />

      <input type="submit" />
    </form>
  );
}

export default ASAForm;
