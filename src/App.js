// import logo from './logo.svg';
import './App.css';
import React from 'react';
import Navbar from './component/navbar.js';
import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    // <div className="app">
    //   <Navbar />
    //   <div className="content">
    //     <h1>Welcome to the Billing System</h1>
    //     <p>Create and manage your bills efficiently.</p>
    //   </div>
    // </div>
    <div className="app">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <div>Hello!</div>
    </div>
  );
}

export default App;
