import React, { useState, useEffect } from 'react';

import {
  TextField,
  Grid,
} from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';

import { fetchUsers } from '../../services/actions';

const UserSearch = (props) => {
  const [users, setUsers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [inputUser, setInputUser] = useState({});
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    fetchUsers()
      .then((res) => {
        console.log(res);
        setUsers(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <>
      <Grid container allign="center" justify="center" alignItems="center">
        <Grid item xs={9}>
          <Autocomplete
            value={selectedUser}
            onChange={(event, newValue) => {
              setSelectedUser(newValue, '{}');
              setAddresses(newValue.addresses, '');
            }}
            inputValue={inputUser}
            onInputChange={(event, newInputValue) => {
              setInputUser(newInputValue, '{}');
            }}
            id="combo-box-users"
            options={users}
            getOptionLabel={(user) => user.username}
            fullWidth
            disableClearable
            renderInput={(params) => <TextField {...params} label="Select user" variant="standard" inputRef={props.register} name="username" fullWidth />}
          />
        </Grid>
      </Grid>

      <Grid container allign="center" justify="center" alignItems="center">
        <Grid item xs={9}>
          <Autocomplete
            value={selectedAddress}
            onChange={(event, newValue) => {
              setSelectedAddress(newValue, '');
            }}
            id="combo-box-addresses"
            options={addresses}
            defaultValue={addresses[0]}
            disableClearable
            fullWidth
            renderInput={(params) => <TextField {...params} label="Select address" variant="standard" inputRef={props.register} name="address" fullWidth />}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default UserSearch;
