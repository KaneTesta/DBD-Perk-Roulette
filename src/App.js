import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css'; 

import Navbar from "./components/navbar.component";
import KillerRandomPerks from "./components/killerperks.component";
import SurvivorRandomPerks from "./components/survivorperks.component";
import DocumentMeta from 'react-document-meta';

const meta = {
  title: 'Dead By Daylight - Perk Roulette',
  description: 'Random perk generator for killers and survivors in the dead by daylight video game',
  meta: {
      charset: 'utf-8',
      name: {
          keywords: 'dead by daylight, random perk picker dead by daylight, dbd, dbd killers, dbd survivors'
      }
  }
}

function App() {
  return (
    <Router>
      <DocumentMeta {...meta} />
      <div className="container">
        <Navbar />
        <br/>
        <Route path="/killer" component={KillerRandomPerks}/>
        <Route path="/"component={SurvivorRandomPerks} />
      </div>
    </Router>
  );
}

export default App;
