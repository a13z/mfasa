import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import Header from "./Header";
// import ReactDatePicker from "react-datepicker";
// import NumberFormat from "react-number-format";
// import ReactSelect from "react-select";
// import options from "./constants/reactSelectOptions";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import {
  TextField,
  Checkbox,
  Button,
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

import { createAsset } from '../../services/AlgoSdkSandbox';

// import MuiAutoComplete from "./MuiAutoComplete";
// import "react-datepicker/dist/react-datepicker.css";

// import ButtonsResult from "./ButtonsResult";
// import DonwShift from "./DonwShift";

// import "./ASAForm.style.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const createTxASA = (values) => {
  console.log(values);
  createAsset('', values.assetName, values.unitName, parseInt(values.totalSupply), values.assetUrl, values.managerAddress, values.reserveAddress, values.freezeAddress, values.clawbackAddress, parseInt(values.decimals));
};

// AlgoSdk.createAsset("Y7DTZHSVUSPZNZ4N5ODX3NPO3SSGE37WCWIHGA7OFDMUCEU3DIVHYHNF2U",
//   values.assetName,
//   values.unitName,
//   values.totalSupply,
//   values.assetURL,
//   values.managerAddress,
//   values.reserveAddress,
//   values.freezeAddress,
//   values.clawbackAddress,
//   values.decimals).then((txn) => {
//     txnToSign = txn;
//     txnToSign.from = "Y7DTZHSVUSPZNZ4N5ODX3NPO3SSGE37WCWIHGA7OFDMUCEU3DIVHYHNF2U";
//     //
//     delete txnToSign.name;
//     delete txnToSign.tag;
//     delete txnToSign.appArgs;

//     console.log(txnToSign);

//   }).catch(error => {
//     console.log(error);
//   })

// AlgoSdk.getChangingParams().then((txParams) => {
//   asTxn = {
//     from: values.managerAddress,
//     assetName: values.assetName,
//     assetUnitName: values.unitName,
//     assetTotal: values.totalSupply,
//     assetDecimals: values.decimals,
//     type: 'acfg',
//     fee: txParams.fee,
//     firstRound: txParams.firstRound,
//     lastRound: txParams.lastRound,
//     genesisID: txParams.genID,
//     genesisHash: txParams.genHash
//   }

//   console.log('Txn changing params' + JSON.stringify(asTxn, null, 2));

//   AlgoSigner.sign(asTxn)
//   .then((d) => {
//     signedTx = d;
//     console.log(JSON.stringify(d, null, 2));
//     console.log(signedTx.txID, signedTx.blob);

//     AlgoSdk.sendTransaction(d.blob).then((tx) => {
//       console.log("Transaction : " + tx.txId);
//     })
//   })
//   .catch((e) => {
//     console.error(e);
//   });

// }).catch(error => {
//   console.log(error);
// })

const ASAForm = ({ asaId }) => {
  const classes = useStyles();
  const [state, setState] = useState({
    defaultFrozen: false,
    defaultSender: false,
  });
  const { register, handleSubmit, errors } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    console.log(event);
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const onSubmit = (data) => createTxASA(data);
  console.log(errors);

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth type="text" placeholder="Asset Name" name="assetName" inputRef={register({ required: true })} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="text" placeholder="Asset Unit" name="assetUnit" inputRef={register({ required: true })} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="number" placeholder="Total Supply" name="totalSupply" inputRef={register({ required: true })} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="number" placeholder="Decimals" name="decimals" inputRef={register({ required: true, min: 0 })} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="url" placeholder="Asset Url" name="assetUrl" inputRef={register} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="text" placeholder="Metadata" name="metadata" inputRef={register({ maxLength: 32 })} />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={(
                <Switch
                  checked={state.defaultFrozen}
                  onChange={handleChange}
                  name="defaultFrozen"
                  inputRef={register}
                  color="primary"
                />
              )}
              label="Frozen by default"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={(
                <Switch
                  checked={state.defaultSender}
                  onChange={handleChange}
                  name="defaultSender"
                  inputRef={register}
                  color="primary"
                />
              )}
              label="Default to Sender"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="text" placeholder="Manager Address" name="managerAddress" inputRef={register({ required: true, minLength: 58, maxLength: 58 })} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="text" placeholder="Reserve Address" name="reserveAddress" inputRef={register({ minLength: 58, maxLength: 58 })} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="text" placeholder="Freeze Address" name="freezeAddress" inputRef={register({ minLength: 58, maxLength: 58 })} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="text" placeholder="Clawback Address" name="clawbackAddress" inputRef={register({ minLength: 58, maxLength: 58 })} />
          </Grid>
          <Grid item xs={3} spacing={9}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              SUBMIT
            </Button>
          </Grid>
        </Grid>

      </form>
    </div>
  );
};

export default ASAForm;
