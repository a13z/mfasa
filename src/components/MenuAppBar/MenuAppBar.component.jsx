import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { Link, navigate } from '@reach/router';

import Logo from '../../images/Moneyfold.png';

import request from '../../services/request';

const useStyles = makeStyles((theme) => ({
  abRoot: {
    backgroundColor: '#3f51b5',
  },
  abStatic: {
    border: 'solid blue 2px',
  },
  header: {
    color: '#0098d5',
    backgroundColor: '#3f51b5',
  },
  navDisplayFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  navbarDisplayFlex: {
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
    flexGrow: 1,
    backgroundColor: theme.palette.primary.light,
    '&.MuiAppBar-positionSticky': {
      '& .MuiToolbar-root': {
        color: '#3f51b5',
        '& .MuiButtonBase-root': {
          fontSize: 24,
        },
      },
    },
  },
  //   menuButton: {
  //     marginRight: theme.spacing(2),
  //   },
  accountButton: {
    marginLeft: 'auto',
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    maxWidth: 160,
  },
}));

const ListLink = (props) => (
  <Link className={props.className} to={props.to}>{props.children}</Link>
);

export default function MenuAppBar({ siteTitle }) {
  const classes = useStyles();
  const [auth, setAuth] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // const { name, email } = getCurrentUser();

  const logout = () => {
    request.clearAuthToken();
    navigate('/app/login');
  };

  useEffect(() => {
    if (request.isLoggedIn()) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        classes={{
          root: classes.abRoot,
          positionStatic: classes.abStatic,
        }}
      >
        <Toolbar>
          <img src={Logo} alt="logo" className={classes.logo} />
          <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
            <ListItem button>
              <ListLink className={classes.linkText} to="/app/asaoverview">
                <Typography className={classes.title} variant="h6" noWrap>
                  Overview
                </Typography>
              </ListLink>
            </ListItem>
            <ListItem button>
              <ListLink className={classes.linkText} to="/app/asaconfig/">
                <Typography className={classes.title} variant="h6" noWrap>
                  Create ASA
                </Typography>
              </ListLink>
            </ListItem>
            <ListItem button>
              <ListLink className={classes.linkText} to="/app/reports/">
                <Typography className={classes.title} variant="h6" noWrap>
                  Reports
                </Typography>
              </ListLink>
            </ListItem>
          </List>
          {auth && (
          <div className={classes.accountButton}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={(event) => {
                event.preventDefault();
                navigate('/app/usersettings');
              }}
              >
                Settings
              </MenuItem>
              <MenuItem onClick={(event) => {
                event.preventDefault();
                logout(() => {
                  setAuth(false);
                  navigate('/app/login');
                });
              }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
