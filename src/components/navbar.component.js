import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <div>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav">
          <li className="navbar-item">
          <Link to="/killer" className="nav-link">Killer</Link>
          </li>
          <li className="navbar-item">
          <Link to="/survivor" className="nav-link">Survivor</Link>
          </li>
        </ul>
        </div>
      </nav>
      <div className="container text-center">
        <h1>Perk Roulette</h1>
      </div>
      </div>
    );
  }
}