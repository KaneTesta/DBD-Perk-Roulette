import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/navbar.component";
import HomePage from "./components/homepage.component";
import KillerRandomPerks from "./components/killerperks.component";
import SurvivorRandomPerks from "./components/survivorperks.component";


function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br/>
        <Route path="/" exact component={HomePage} />
        <Route path="/killer" component={KillerRandomPerks}/>
        <Route path="/survivor"component={SurvivorRandomPerks} />
      </div>
    </Router>
  );
}

export default App;