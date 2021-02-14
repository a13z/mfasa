import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const ListLink = (props) => (
  <li style={{ display: 'inline-block', marginRight: '1rem' }}>
    <Link to={props.to}>{props.children}</Link>
  </li>
);

const Header = ({ siteTitle }) => (
  <header>
    <div>
      <h3>
        <ul style={{ listStyle: 'none', float: 'left' }}>
          <ListLink to="/">{siteTitle}</ListLink>
          <ListLink to="/asamanager/">ASA Manager</ListLink>
          <ListLink to="/asaconfig/">ASA Config</ListLink>
          <ListLink to="/reports/">Reports</ListLink>
        </ul>
      </h3>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
