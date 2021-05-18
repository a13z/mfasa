import React, { useState, useContext, useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import {
  TextField,
  Box,
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
import FormCheckBox from '../Controls/checkbox';
import FormInput from '../Controls/input';

import AlgoSignerContext from '../../contexts/algosigner.context';

import AlgoClient from '../../services/AlgoClient';

// import "./ASAForm.style.scss";
const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    // textAlign: 'center',
    // color: theme.palette.text.secondary,
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
  name: yup
    .string().required('Asset Name Field is Required'),
  'unit-name': yup
    .string()
    .max(8, 'Unit Name field must be lower than 9 characters')
    .required('Unit Name Field is Required'),
  total: yup
    .number()
    .max(10000000000000000000)
    .typeError('Total Supply must be a number')
    .required('Total Supply Field is Required'),
  url: yup
    .string()
    .url()
    .typeError('Asa URL must contain https://'),
  decimals: yup
    .number()
    .typeError('Decimals must be a number')
    .required('Decimals Field is Required and must be a number'),
  manager: yup
    .string()
    .required('Manager Address is required'),
});

const ASAForm = ({ assetId }) => {
  console.log('ASAForm assetId');
  console.log(assetId);

  const isEditMode = !!assetId;

  const ctx = useContext(AlgoSignerContext);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();
  const [defaultFrozen, setDefaultFrozen] = useState(false);
  const [defaultSender, setDefaultSender] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [asaTxn, setAsaTxn] = useState({
    txId: null,
    confirmed: false,
    round: 0,
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    handleSubmit, setValue, register, errors,
  } = methods;

  useEffect(() => {
    const algoClient = new AlgoClient(ctx.ledger);
    if (isEditMode) {
      algoClient.getAssetInformation(parseInt(assetId))
        .then((response) => {
          console.log(JSON.stringify(response));
          setLoading(false);
          const fields = ['name', 'unit-name', 'total', 'decimals', 'url', 'metadata-hash', 'default-frozen', 'manager', 'freeze', 'reserve', 'clawback'];
          fields.forEach((field) => setValue(field, response.asset.params[field]));

          setDefaultFrozen(response.asset.params['default-frozen']);

          const addressesSet = new Set();
          addressesSet.add(response.asset.params.manager, response.asset.params.freeze, response.asset.params.reserve, response.asset.params.clawback);

          if (addressesSet.size == 1) {
            setDefaultSender(true);
          } else {
            setDefaultSender(false);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, []);

  const createASATx = (values, setLoading, setSubmitted) => {
    const { AlgoSigner } = window;
    const algoClient = new AlgoClient(ctx.ledger);

    console.log(values);

    if (assetId === undefined) {
    // Create transaction
      algoClient.createAssetTxn(
        ctx.currentAddress,
        values.name,
        values['unit-name'],
        parseInt(values.total),
        parseInt(values.decimals),
        values.url,
        values['metadata-hash'],
        values.defaultFrozen,
        values.manager,
        values.reserve,
        values.freeze,
        values.clawback,
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
    } else {
      algoClient.modifyAssetTxn(
        ctx.currentAddress,
        assetId,
        values.manager,
        values.reserve,
        values.freeze,
        values.clawback,
      ).then((txnToSign) => {
        console.log('Transaction createModifyTxn created');
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
    }
  };

  const handleDefaultSenderChange = (event) => {
    event.persist();
    console.log(event);
    setDefaultSender(event.target.checked);
    const fields = ['manager', 'freeze', 'reserve', 'clawback'];

    if (event.target.checked) {
      fields.forEach((field) => setValue(field, ctx.currentAddress));
    } else {
      fields.forEach((field) => setValue(field, ''));
    }
  };

  const handleDefaultFrozenChange = (event) => {
    setDefaultFrozen(event.target.checked);
  };

  const onSubmit = (data) => {
    try {
      setLoading(true);
      setSubmitted(false);
      console.log(data);
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
      <p>
        Asset has been `
        {isEditMode ? 'updated' : 'created' }
        `
      </p>
      <p>
        TxId:
        {asaTxn.txId}
      </p>
      <p>
        Round:
        {asaTxn.round}
      </p>
      {/* <Button
        variant="contained"
        color="primary"
        onClick={() => setSubmitted(false)}
      >
        Create another asset
      </Button> */}
    </div>
  );

  const showForm = (
    <Grid
      container
      spacing={0}
      // align="center"
      // justify="center"
      // alignItems="center"
    >
      { loading ? <LinearProgress />
        : (
          <div className={classes.root}>
            <h3>{isEditMode ? `Edit ASA ${assetId}` : 'Create ASA'}</h3>
            <FormProvider {...methods}>
              <form>
                <Grid container spacing={4}>
                  <Grid item xs={3}>
                    <FormInput name="name" label="Asset Name" required errorobj={errors} />
                  </Grid>
                  <Grid item xs={3}>
                    <FormInput name="unit-name" label="Unit Name" required errorobj={errors} />
                  </Grid>
                  <Grid item xs={3}>
                    <FormInput name="total" label="Total Supply" type="number" required errorobj={errors} />
                  </Grid>
                  <Grid item xs={3}>
                    <FormInput name="decimals" label="Decimals" type="number" required errorobj={errors} />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInput name="url" label="Asset Url" type="url" required errorobj={errors} />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInput name="metadata-hash" label="Metadata Hash" />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <FormCheckBox name="default-frozen" label="Frozen by default" defaultValue={defaultFrozen} onChange={handleDefaultFrozenChange} /> */}
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={defaultFrozen}
                          onChange={handleDefaultFrozenChange}
                          name="default-frozen"
                          inputRef={register}
                          color="primary"
                        />
                  )}
                      label="Frozen by default"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <FormCheckBox name="default-sender" label="Default to Sender" defaultValue={defaultSender} onChange={handleDefaultSenderChange} /> */}
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={defaultSender}
                          onChange={handleDefaultSenderChange}
                          name="default-sender"
                          inputRef={register}
                          color="primary"
                        />
                  )}
                      label="Default to Sender"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormInput name="manager" label="Manager Address" required errorobj={errors} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormInput name="reserve" label="Reserve Address" />

                  </Grid>
                  <Grid item xs={12}>
                    <FormInput name="freeze" label="Freeze Address" />

                  </Grid>
                  <Grid item xs={12}>
                    <FormInput name="clawback" label="Clawback Address" />
                  </Grid>
                </Grid>
                <Box
                  align="center"
                  justify="center"
                  alignItems="center"
                  p={2}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                  >
                    {isEditMode ? 'Edit' : 'Create' }
                  </Button>
                </Box>

              </form>
            </FormProvider>
          </div>
        )}
    </Grid>
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
