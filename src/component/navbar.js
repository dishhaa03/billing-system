import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo">Billing System</span>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/user">User</Link></li>
          <li><Link to="/bills">Billing</Link></li>
          <li><Link to="/insights">Insight</Link></li>
        </ul>
      </div>
      <Link to="/bills/new"><button className="new-bill-button">New Bill</button></Link>
    </nav>
  );
};

export default Navbar;
