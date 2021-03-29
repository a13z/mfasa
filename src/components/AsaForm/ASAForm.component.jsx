import React, { useState, useContext, useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import {
  TextField,
  Container,
  Button,
  Grid,
  FormControlLabel,
  LinearProgress,
  Switch,
} from '@material-ui/core';

import { useForm, Controller, FormProvider } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSnackbar } from 'notistack';

import AlgoSignerContext from '../../contexts/algosigner.context';

import AlgoClient from '../../services/AlgoClient';

// import "./ASAForm.style.scss";
const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const validationSchema = yup.object().shape({
  assetName: yup.string().required('Asset Name Field is Required'),
  unitName: yup
    .string()
    .max(8, 'Unit Name field must be lower than 9 characters')
    .required('Unit Name Field is Required'),
  totalSupply: yup
    .number()
    .max(10000000000000000000)
    .typeError('Total Supply must be a number')
    .required('Total Supply Field is Required'),
  asaUrl: yup
    .string()
    .url()
    .typeError('Asa URL must contain https://'),
  decimals: yup
    .number()
    .typeError('Decimals must be a number')
    .required('Decimals Field is Required and must be a number'),
  managerAddress: yup
    .string()
    .required('Manager Address is required'),
});

const ASAForm = ({ asaId }) => {
  const ctx = useContext(AlgoSignerContext);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
    errors,
    handleSubmit,
    register,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const createASATx = (values, setLoading, setSubmitted) => {
    const { AlgoSigner } = window;
    const algoClient = new AlgoClient(ctx.ledger);

    console.log(values);

    // Create transaction
    algoClient.createAssetTxn(
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
      console.log('Transaction createAssetTxn created');
      console.log(txnToSign);
      AlgoSigner.sign(txnToSign)
        .then((signedTxn) => {
          console.log('Signing txn');
          console.log(JSON.stringify(signedTxn, null, 2));
          console.log(signedTxn.txID, signedTxn.blob);

          algoClient.sendTransaction(signedTxn.blob)
            .then((txnSent) => {
              console.log('Txn signed sent');
              console.log(txnSent);
              algoClient.waitForConfirmation(txnSent.txId)
                .then((response) => {
                  setAsaTxn(
                    {
                      txId: txnSent.txId,
                      confirmed: true,
                      round: response,
                    },
                  );
                  console.log(response);
                  enqueueSnackbar(
                    `Transaction with txId ${txnSent.txId} has been confirmed in Round ${response}`,
                    {
                      variant: 'success',
                    },
                  );
                  setLoading(false);
                  setSubmitted(true);
                });
            })
            .catch((e) => {
              setLoading(false);
              console.error(e);
              enqueueSnackbar(
                'Error: There is an error sending transaction to Algorand node',
                {
                  variant: 'error',
                },
              );
            });
        })
        .catch((e) => {
          setLoading(false);
          console.error(e);
          enqueueSnackbar('Error: There is an error sending transaction to Algorand node', {
            variant: 'error',
          });
        });
    })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        enqueueSnackbar('Error: There is an error communicating with Algorand node', {
          variant: 'error',
        });
      }).finally(() => {

      });
  };

  const handleDefaultSenderChange = (event) => {
    event.persist();
    console.log(event);
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

  const onSubmit = (data) => {
    try {
      setLoading(true);
      setSubmitted(false);
      createASATx(data, setLoading, setSubmitted);
    } catch (error) {
      enqueueSnackbar(
        `Oops! There seems to be an issue! ${error.message}`,
        {
          variant: 'error',
        },
      );
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => setSubmitted(false)}
      >
        Create another asset
      </Button>
    </div>
  );

  const showForm = (
    <Container className={classes.container}>
      { loading ? <LinearProgress />
        : (
          <div className={classes.root}>
            <form>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <TextField
                    label="Asset Name"
                    type="text"
                    placeholder="Asset Name"
                    name="assetName"
                    fullWidth
                    required
                    disabled={isSubmitting}
                    inputRef={register}
                    error={!!errors.assetName}
                    helperText={errors.assetName ? errors.assetName.message : ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Unit Name"
                    type="text"
                    placeholder="Unit Name"
                    name="unitName"
                    fullWidth
                    required
                    disabled={isSubmitting}
                    inputRef={register}
                    error={!!errors.unitName}
                    helperText={errors.unitName ? errors.unitName.message : ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Total Supply"
                    type="number"
                    placeholder="Total Supply"
                    name="totalSupply"
                    fullWidth
                    required
                    disabled={isSubmitting}
                    inputRef={register}
                    error={!!errors.totalSupply}
                    helperText={errors.totalSupply ? errors.totalSupply.message : ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Decimals"
                    type="number"
                    placeholder="Decimals"
                    name="decimals"
                    fullWidth
                    required
                    disabled={isSubmitting}
                    inputRef={register}
                    error={!!errors.decimals}
                    helperText={errors.decimals ? errors.decimals.message : ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Asset Url"
                    type="url"
                    placeholder="Asset Url"
                    name="assetUrl"
                    fullWidth
                    required
                    disabled={isSubmitting}
                    inputRef={register}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Metadata"
                    type="text"
                    placeholder="Metadata"
                    name="metadata"
                    fullWidth
                    required
                    disabled={isSubmitting}
                    inputRef={register}
                  />
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
                  <TextField
                    label="Manager Address"
                    type="text"
                    placeholder="Manager Address"
                    name="managerAddress"
                    value={managerAddress || ''}
                    fullWidth
                    required
                    disabled={isSubmitting}
                    inputRef={register}
                    error={!!errors.managerAddress}
                    helperText={errors.managerAddress ? errors.managerAddress.message : ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Reserve Address"
                    type="text"
                    placeholder="Reserve Address"
                    name="reserveAddress"
                    value={reserveAddress || ''}
                    fullWidth
                    disabled={isSubmitting}
                    inputRef={register}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Freeze Address"
                    type="text"
                    placeholder="Freeze Address"
                    name="freezeAddress"
                    value={freezeAddress || ''}
                    fullWidth
                    disabled={isSubmitting}
                    inputRef={register}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Clawback Address"
                    type="text"
                    placeholder="Clawback Address"
                    name="clawbackAddress"
                    value={clawbackAddress || ''}
                    fullWidth
                    disabled={isSubmitting}
                    inputRef={register}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    fullWidth
                    disabled={isSubmitting}

                  >
                    SUBMIT
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        )}
    </Container>
  );
  return (
    <div className="asa create-asa-page">
      <div className="form-side">
        { loading ? showLinearProgress : submitted ? showAsaCreatedMessage : showForm}
      </div>
    </div>

  );
};

export default ASAForm;
