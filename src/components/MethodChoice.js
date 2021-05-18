import React from 'react';
// import classnames from 'classnames';
import {
  Typography,
  MenuItem,
  Grid,
} from '@material-ui/core';

import View from './View';

export const MethodChoice = ({
  label,
  methods,
  value,
  onChange,
  error,
}) => (
  <Grid
    container
    spacing={0}
    align="center"
    justify="right"
    alignItems="center"
  >
    <View>
      <div>
        <Typography>
          {label}
        </Typography>
        <ul style={{ padding: 0 }}>
          {methods.map((method) => (
            <MenuItem
              key={method.name}
              onClick={() => onChange(method.name)}
            >
              {method.name}
            </MenuItem>
          ))}
        </ul>
        {error && (
        <Typography color="error">
          {error}
        </Typography>
        )}
      </div>
    </View>
  </Grid>
);

MethodChoice.defaultProps = {
  label: 'Choose one of the methods',
};
