import React from 'react';

import {
  AppBar, Toolbar, List, ListItem, ListItemText, IconButton, Container,
  makeStyles,
} from '@material-ui/core';
import { Home } from '@material-ui/icons';

import { Link } from 'gatsby';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  navDisplayFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  linkText: {
    textDecoration: 'none',
    textTransform: 'uppercase',
    color: 'white',
  },
  navbarDisplayFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const ListLink = (props) => (
  <Link className={props.className} to={props.to}>{props.children}</Link>
);

const Header = ({ siteTitle }) => {
  const classes = useStyles();

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Container className={classes.navbarDisplayFlex}>
            <IconButton edge="start" color="inherit" aria-label="home">
              <Home fontSize="large" />
            </IconButton>
            <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
              <ListItem button>
                <ListLink className={classes.linkText} to="/">{siteTitle}</ListLink>
              </ListItem>
              <ListItem button>
                <ListLink className={classes.linkText} to="/asaconfig/">ASA config</ListLink>
              </ListItem>
              <ListItem button>
                <ListLink className={classes.linkText} to="/reports/">Reports</ListLink>
              </ListItem>
            </List>
          </Container>
        </Toolbar>
      </AppBar>
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
