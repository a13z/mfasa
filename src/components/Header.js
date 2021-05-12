import React from 'react';

import {
  AppBar, Toolbar, List, ListItem, ListItemText, IconButton, Container, Button,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import { Home } from '@material-ui/icons';

import { Link } from 'gatsby';
import PropTypes from 'prop-types';

import MenuAppBar from './MenuAppBar/MenuAppBar.component';

const useStyles = makeStyles((theme) => ({
  navDisplayFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  linkText: {
    textDecoration: 'none',
    textTransform: 'uppercase',
    color: 'white',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  root: {
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  navbarDisplayFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    flexGrow: 1,
  },
}));

const ListLink = (props) => (
  <Link className={props.className} to={props.to}>{props.children}</Link>
);

const Header = ({ siteTitle }) => {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      <MenuAppBar siteTitle={siteTitle} />
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
