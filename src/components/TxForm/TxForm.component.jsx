import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import {
  TextField,
  Container,
  Button,
  Grid,
  InputLabel,
  Select,
  FormControl,
  FormControlLabel,
  LinearProgress,
  MenuItem,
  Switch,
} from '@material-ui/core';

import { useForm, Controller } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSnackbar } from 'notistack';

import AlgoSignerContext from '../../contexts/algosigner.context';

import AlgoSdk from '../../services/AlgoSdk';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
    whiteSpace: 'unset',
    wordBreak: 'break-all',
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .max(10000000000000000000)
    .typeError('Amount must be a number')
    .required('Amount field is Required'),
  address: yup
    .string()
    .required('Manager Address is required'),
});

const transactionTypes = [
  { value: 'send', text: 'Send' },
  { value: 'freeze', text: 'Freeze' },
  { value: 'unfreeze', text: 'Unfreeze' },
  { value: 'revoke', text: 'Revoke' },
];

const TxForm = ({ assetId }) => {
  const ctx = useContext(AlgoSignerContext);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();
  //   const [address, setAddress] = useState('');
  //   const [amount, setAmount] = useState(0);
  const [transactionType, setTransactionType] = useState('');

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
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const createAlgoSignerTransaction = async (values) => {
    const { AlgoSigner } = window;
    console.log(values);

    const transaction = await AlgoSdk.createAlgoSignerTransaction(
      values.transactionType,
      ctx.currentAddress,
      values.address,
      values.amount,
      'MFASA',
      assetId,
    );
    console.log(transaction);
    AlgoSigner.sign(transaction)
      .then((signedTxn) => {
        console.log('Transaction signed');
        console.log(JSON.stringify(signedTxn, null, 2));
        console.log(signedTxn.txID, signedTxn.blob);

        AlgoSdk.sendTransaction(signedTxn.blob)
          .then((txnSent) => {
            console.log('Transaction sent');
            console.log(txnSent);
            AlgoSdk.waitForConfirmation(txnSent.txId)
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
  };

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
  };

  const onSubmit = (data) => {
    try {
      setLoading(true);
      setSubmitted(false);
      createAlgoSignerTransaction(data);
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

  const showAsaCreatedMessage = (
    <div className="msg-confirm">
      <p>Awesome! Tx has been created.</p>
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
    <Container className={classes.container}>
      { loading ? <LinearProgress />
        : (
          <div className={classes.root}>
            <form>
              <Grid container>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="transaction-type-select" id="transaction-type-select">
                      Select Transaction Type
                    </InputLabel>
                    <Controller
                      control={control}
                      name="transactionType"
                      defaultValue=""
                      as={(
                        <Select id="transaction-type-select">
                          {transactionTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.text}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <TextField
                    label="Address"
                    type="text"
                    placeholder="Address"
                    name="address"
                    fullWidth
                    disabled={isSubmitting}
                    inputRef={register}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <TextField
                    label="Amount"
                    type="number"
                    placeholder="Amount"
                    name="amount"
                    fullWidth
                    disabled={isSubmitting}
                    inputRef={register}
                    error={!!errors.amount}
                    helperText={errors.amount ? errors.amount.message : ''}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4}>
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
        {submitted ? showAsaCreatedMessage : showForm}
      </div>
    </div>
  );
};

export default TxForm;

TxForm.propTypes = {
  assetId: PropTypes.number,
};
