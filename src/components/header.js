import React from 'react';

import {
  AppBar, Toolbar, List, ListItem, ListItemText, IconButton, Container,
} from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import { Home } from '@material-ui/icons';

import { Link } from 'gatsby';
import PropTypes from 'prop-types';

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
      <AppBar position="static">
        <Toolbar>
          <Container className={classes.root}>
            <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
              <ListItem button>
                <ListLink className={classes.linkText} to="/">
                  <Typography className={classes.title} variant="h6" noWrap>
                    {siteTitle}
                  </Typography>
                </ListLink>
              </ListItem>
              <ListItem button>
                <ListLink className={classes.linkText} to="/asaconfig/">
                  <Typography className={classes.title} variant="h6" noWrap>
                    ASA config
                  </Typography>
                </ListLink>
              </ListItem>
              <ListItem button>
                <ListLink className={classes.linkText} to="/reports/">
                  <Typography className={classes.title} variant="h6" noWrap>
                    Reports
                  </Typography>
                </ListLink>
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
