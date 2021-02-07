import React, { useState, useContext, useEffect } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
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
  Container,
  Button,
  Select,
  MenuItem,
  Switch,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
  ThemeProvider,
  Radio,
  createMuiTheme,
  Slider,
} from '@material-ui/core';
import AlgoSignerContext from '../../contexts/algosigner.context';

import AlgoSdk from '../../services/AlgoSdk';
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

const ASAForm = ({ asaId }) => {
  const ctx = useContext(AlgoSignerContext);

  const classes = useStyles();
  const [defaultFrozen, setDefaultFrozen] = useState(false);
  const [defaultSender, setDefaultSender] = useState(false);
  const [managerAddress, setManagerAddress] = useState();
  const [freezeAddress, setFreezeAddress] = useState();
  const [reserveAddress, setReserveAddress] = useState();
  const [clawbackAddress, setClawbackAddress] = useState();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [asaTxn, setAsaTxn] = useState({
    txId: null,
    confirmed: false,
    round: 0,
  });

  const {
    register,
    handleSubmit,
    setError,
    errors,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const createASATx = (values) => {
    const { AlgoSigner } = window;
    console.log(values);

    // Create transaction
    AlgoSdk.createAssetTxn(
      ctx.currentAddress,
      values.assetName,
      values.unitName,
      parseInt(values.totalSupply),
      parseInt(values.decimals),
      values.assetUrl,
      values.metadata,
      values.defaultFrozen,
      values.managerAddress,
      values.reserveAddress,
      values.freezeAddress,
      values.clawbackAddress,
    ).then((txnToSign) => {
      console.log('Transaction createAssetTxn');
      console.log(txnToSign);
      AlgoSigner.sign(txnToSign)
        .then((signedTxn) => {
          console.log('Signing txn');
          console.log(JSON.stringify(signedTxn, null, 2));
          console.log(signedTxn.txID, signedTxn.blob);

          AlgoSdk.sendTransaction(signedTxn.blob).then((txnSent) => {
            console.log('Txn signed sent');
            console.log(txnSent);
            AlgoSdk.waitForConfirmation(txnSent.txId).then((response) => {
              setAsaTxn(
                {
                  txId: txnSent.txId,
                  confirmed: true,
                  round: response,
                },
              );
              console.log(response);
            });
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleDefaultSenderChange = (event) => {
    setDefaultSender(event.target.checked);

    if (event.target.checked) {
      setManagerAddress(ctx.currentAddress);
      setFreezeAddress(ctx.currentAddress);
      setReserveAddress(ctx.currentAddress);
      setClawbackAddress(ctx.currentAddress);
    } else {
      setManagerAddress();
      setFreezeAddress();
      setReserveAddress();
      setClawbackAddress();
    }
  };

  const handleDefaultFrozenChange = (event) => {
    setDefaultFrozen(event.target.checked);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setSubmitted(false);
      createASATx(data);
      setLoading(false);
      setSubmitted(true);
      reset();
    } catch (error) {
      setError(
        'submit',
        'submitError',
        `Oops! There seems to be an issue! ${error.message}`,
      );
    }
  };

  const showLinearProgress = (
    <LinearProgress />
  );

  const showSubmitError = (msg) => <p className="msg-error">{msg}</p>;

  const showAsaCreatedMessage = (
    <div className="msg-confirm">
      <p>Awesome! Asset has been created.</p>
      <p>
        TxId:
        {asaTxn.txId}
      </p>
      <p>
        Round:
        {asaTxn.round}
      </p>
      <button type="button" onClick={() => setSubmitted(false)}>
        Create another asset?
      </button>
    </div>
  );

  const showForm = (
    <Container>
      <div className={classes.root}>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            { loading ? <LinearProgress /> : showLinearProgress }
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} fullWidth type="text" placeholder="Asset Name" name="assetName" inputRef={register({ required: true })} />
            </Grid>
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} required fullWidth type="text" placeholder="Asset Unit" name="unitName" inputRef={register({ required: true })} />
            </Grid>
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} fullWidth type="number" placeholder="Total Supply" name="totalSupply" inputRef={register({ required: true })} />
            </Grid>
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} fullWidth type="number" placeholder="Decimals" name="decimals" inputRef={register({ required: true, min: 0 })} />
            </Grid>
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} fullWidth type="url" placeholder="Asset Url" name="assetUrl" inputRef={register} />
            </Grid>
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} fullWidth type="text" placeholder="Metadata" name="metadata" inputRef={register({ maxLength: 32 })} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={(
                  <Switch
                    checked={defaultFrozen}
                    onChange={handleDefaultFrozenChange}
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
                    checked={defaultSender}
                    onChange={handleDefaultSenderChange}
                    name="defaultSender"
                    inputRef={register}
                    color="primary"
                  />
              )}
                label="Default to Sender"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} value={managerAddress || ''} fullWidth type="text" placeholder="Manager Address" name="managerAddress" inputRef={register({ required: true, minLength: 58, maxLength: 58 })} />
            </Grid>
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} fullWidth type="text" value={reserveAddress || ''} placeholder="Reserve Address" name="reserveAddress" inputRef={register({ minLength: 58, maxLength: 58 })} />
            </Grid>
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} fullWidth type="text" value={freezeAddress || ''} placeholder="Freeze Address" name="freezeAddress" inputRef={register({ minLength: 58, maxLength: 58 })} />
            </Grid>
            <Grid item xs={6}>
              <TextField disabled={isSubmitting} fullWidth type="text" value={clawbackAddress || ''} placeholder="Clawback Address" name="clawbackAddress" inputRef={register({ minLength: 58, maxLength: 58 })} />
            </Grid>
            <Grid item xs={3} spacing={9}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                SUBMIT
              </Button>
            </Grid>
          </Grid>

        </form>
      </div>
    </Container>
  );
  return (
    <div className="asa create-asa-page">
      <div className="form-side">
        {submitted ? showAsaCreatedMessage : showForm}
      </div>
    </div>

  );
};

export default ASAForm;
