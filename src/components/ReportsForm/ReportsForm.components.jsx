import React, { useEffect, useState, useContext } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DatePicker,
} from '@material-ui/pickers';

import {
  TextField,
  Container,
  Box,
  Button,
  Grid,
  InputLabel,
  Select,
  FormControl,
  FormControlLabel,
  FormHelperText,
  LinearProgress,
  MenuItem,
  Switch,
} from '@material-ui/core';

import { useForm, Controller, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import ASATransactionsTable from '../ASATransactionsTable/ASATransactionsTable.component';
import AlgoSignerContext from '../../contexts/algosigner.context';

import AlgoClient from '../../services/AlgoClient';

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
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
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

// helper for yup transform function
function emptyStringToNull(value, originalValue) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return null;
  }
  return value;
}

const validationSchema = yup.object().shape({
  minBalance: yup
    .number()
    .transform(emptyStringToNull)
    .nullable()
    .typeError('Amount must be a number'),
  maxBalance: yup
    .number()
    .transform(emptyStringToNull)
    .nullable()
    .typeError('Amount must be a number'),
  asset: yup
    .number()
    .typeError('Asset is required'),
});

const defaultValues = {
  address: '',
  asset: 14038595,
  fromDate: 'new Date().toISOString().substr(0, 10))',
  maxBalance: null,
  minBalance: null,
  toDate: 'new Date().toISOString().substr(0, 10))',
  transactionType: 'all',
};

const transactionTypes = [
  { value: 'all', text: 'All' },
  { value: 'pay', text: 'Payment' },
  { value: 'keyreg', text: 'Key Registration' },
  { value: 'acfg', text: 'Asset Configuration' },
  { value: 'afrz', text: 'Asset Freeze' },
  { value: 'axfer', text: 'Asset Transfer' },
];

const createdAssets = {};

export default function ReportsForm(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();

  const ctx = useContext(AlgoSignerContext);

  const [accountDetails, setAccountDetails] = useState({});
  const [assetList, setAssetList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [response, setResponse] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFromDate, setSelectedFromDate] = React.useState();
  const [selectedToDate, setSelectedToDate] = React.useState();

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date.toISOString().substr(0, 10));
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date.toISOString().substr(0, 10));
  };

  const getAccountDetails = async (address) => {
    const algoClient = new AlgoClient(ctx.ledger);

    const accountDetails = await algoClient.getIndexer().lookupAccountByID(address).do();
    console.log('Reports: getAccountDetails ');
    console.log(accountDetails);
    return accountDetails.account;
  };

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

  const fetchTransactions = async ({
    address, asset, fromDate, toDate, minBalance, maxBalance, transactionType,
  }) => {
    console.log(asset);
    if (transactionType === 'all') {
      transactionType = '';
    }
    const algoClient = new AlgoClient(ctx.ledger);

    const transactionsResults = await algoClient.indexer.lookupAssetTransactions(asset)
      .address(address)
      .txType(transactionType)
      .beforeTime(toDate)
      .afterTime(fromDate)
      .currencyGreaterThan(minBalance)
      .currencyLessThan(maxBalance)
      .do();
    console.log(transactionsResults);
    setResponse(transactionsResults);
  };

  const onSubmit = (data) => {
    console.log(data);

    fetchTransactions(data);
  };

  console.log(errors);

  useEffect(() => {
    const algoClient = new AlgoClient(ctx.ledger);

    setLoading(true);
    if (ctx.currentAddress) {
      getAccountDetails(ctx.currentAddress)
        .then((response) => {
          setLoading(false);
          console.log(response);
          setAccountDetails(response);
          setAssetList(response['created-assets']);
          response['created-assets'].forEach((asset) => {
            createdAssets[asset.index] = asset.params;
          });
          console.log(JSON.stringify(createdAssets));
        // fetchTransactions();
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [ctx]);

  return (
    <div>
      { loading ? <LinearProgress />
        : (
          <Grid
            container
            spacing={0}
            align="center"
            justify="center"
            alignItems="center"
          >

            <form className={classes.container}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>

                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <Controller
                      fullWidth
                      name="fromDate"
                      control={control}
                      valueName="selected" // DateSelect value's name is selected
                      onChange={([selected]) => selected.toISOString().substr(0, 10)}
                      as={(
                        <DatePicker
                          disableToolbar
                          disableFuture
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="from-date-picker-inline"
                          label="From"
                          value={selectedFromDate}
                          onChange={handleFromDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      fullWidth
                      name="toDate"
                      control={control}
                      valueName="selected" // DateSelect value's name is selected
                      onChange={([selected]) => selected.toISOString().substr(0, 10)}
                      as={(
                        <DatePicker
                          disableToolbar
                          disableFuture
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="to-date-picker-inline"
                          label="To"
                          value={selectedToDate}
                          onChange={handleToDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                    )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="aset-select"
                        id="asset-input-label"
                      >
                        Select Asset
                      </InputLabel>
                      <Controller
                        control={control}
                        name="asset"
                        defaultValue=""
                        as={(
                          <Select
                            id="asset-select"
                          >
                            {assetList.map((asset) => (
                              <MenuItem key={asset.index} value={asset.index}>
                                {asset.params.name}
                              </MenuItem>
                            ))}
                          </Select>
                      )}
                      />
                      {!!errors.asset && <FormHelperText>Select an Asset</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="transaction-type-select" id="transaction-type-select">
                        Select Transaction Type
                      </InputLabel>
                      <Controller
                        control={control}
                        name="transactionType"
                        defaultValue="all"
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
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      type="text"
                      placeholder="Address"
                      name="address"
                      fullWidth
                      disabled={isSubmitting}
                      inputRef={register}
                      error={!!errors.address}
                      helperText={errors.address ? errors.address.message : ''}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <TextField
                      label="Min Balance"
                      type="number"
                      placeholder="Min Balance"
                      name="minBalance"
                      fullWidth
                      disabled={isSubmitting}
                      inputRef={register}
                      error={!!errors.minBalance}
                      helperText={errors.minBalance ? errors.minBalance.message : ''}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Max Balance"
                      type="number"
                      placeholder="Max Balance"
                      name="maxBalance"
                      fullWidth
                      disabled={isSubmitting}
                      inputRef={register}
                      error={!!errors.maxBalance}
                      helperText={errors.maxBalance ? errors.maxBalance.message : ''}
                    />
                  </Grid>
                </Grid>
                <Box p={2}>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    SUBMIT
                  </Button>

                </Box>

              </MuiPickersUtilsProvider>
            </form>
          </Grid>
        )}
      {(response.transactions && <ASATransactionsTable transactions={response.transactions} assetsCreated={createdAssets} />)}
    </div>
  );
}
