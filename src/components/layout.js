import React from "react"
import { Link } from "gatsby"

import AlgoSigner from '../components/AlgoSigner/AlgoSigner.component'

const ListLink = props => (
  <li style={{ display: `inline-block`, marginRight: `1rem` }}>
    <Link to={props.to}>{props.children}</Link>
  </li>
)

export default function Layout({ children }) {
  return (
    <div style={{ margin: `3rem auto`, maxWidth: 650, padding: `0 1rem` }}>
      <header style={{ marginBottom: `1.5rem` }}>
        <Link to="/" style={{ textShadow: `none`, backgroundImage: `none` }}>
          <h3 style={{ display: `inline` }}>MFASA</h3>
        </Link>
        <ul style={{ listStyle: `none`, float: `right` }}>
          <ListLink to="/">Home</ListLink>
          <ListLink to="/asamanager/">ASA Manager</ListLink>
          <ListLink to="/asaconfig/">ASA Config</ListLink>
          <ListLink to="/reports/">Reports</ListLink>
          <br/>
          
        </ul>
      
      </header>
      <AlgoSigner>
        {children}
      </AlgoSigner>
    </div>
  )
}