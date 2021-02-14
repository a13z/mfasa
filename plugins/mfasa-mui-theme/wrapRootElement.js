import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import theme from './theme';

export const wrapRootElement = ({ element }) => {
  console.info('theme', theme);
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        {element}
      </SnackbarProvider>
    </ThemeProvider>
  );
};
