import React, { Component } from 'react';
import axios from 'axios';

const Perk = props => (
  <tr>
    <td>{props.perk.perk_name}</td>
    <td>{props.perk.description}</td>
    <td><img src={props.perk.icon}></img></td>
  </tr>
)


export default class SurvivorRandomPerks extends Component {
  
  constructor(props) {
    super(props);

    this.state = {perks: []};
  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_BASE_API_URL + '/perks?lang=en&role=Survivor&is_ptb=false', {'Content-Type': 'application/json'})
    .then(response => {
      this.setState({perks: response.data})
    })
    .catch((error) => {
      console.log(error)
    });
  }

  perksList() {
    return this.state.perks.map(currentPerk => {
      return <Perk perk={currentPerk} key={currentPerk._id}/>;
    })
  }

  render() {
    return (
      <table>
        <tbody>
          { this.perksList() }
        </tbody>
      </table>
    );
  }
}