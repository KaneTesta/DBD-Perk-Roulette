import React, { Component } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table'

const Perk = props => (
  <tr>
    <td><img src={props.perk.icon} alt={props.perk.perk_name}></img></td>
    <td>{props.perk.perk_name}</td>
    <td>{props.perk.description}</td>
    <td>{props.perk.name}</td>
  </tr>
)

const Item = item => (
  <tr>
    <td></td>
    <td>{item.item.displayName}</td>
    <td dangerouslySetInnerHTML={{__html: item.item.description}}></td>
    <td></td>
  </tr>
)

const Addon = addon => (
  <tr>
    <td></td>
    <td>{addon.addon.displayName}</td>
    <td dangerouslySetInnerHTML={{__html: addon.addon.description}}></td>
    <td></td>
  </tr>
)

const Offering = offering => (
  <tr>
    <td></td>
    <td>{offering.offering.displayName}</td>
    <td dangerouslySetInnerHTML={{__html: offering.offering.description}}></td>
    <td></td>
  </tr>
)


export default class SurvivorRandomPerks extends Component {
  
  constructor(props) {
    super(props);

    this.state = {perks: [], item: [], addons: [], offering: []};
  }

  componentDidMount() {

    //Build Random Perks
    axios.get(process.env.REACT_APP_BASE_API_URL + '/perks?lang=en&role=Survivor&is_ptb=false', {'Content-Type': 'application/json'})
    .then(response => {

      var fullData = response.data;
      var responseLength = fullData.length;
      var randPerks = [Math.floor(Math.random() * responseLength), Math.floor(Math.random() * responseLength), Math.floor(Math.random() * responseLength), Math.floor(Math.random() * responseLength)];

      var selectedPerks = [fullData[randPerks[0]], fullData[randPerks[1]], fullData[randPerks[2]], fullData[randPerks[3]]]

      this.setState({perks: selectedPerks})
    })
    .catch((error) => {
      console.log(error)
    });

    //Build random Items
    axios.get(process.env.REACT_APP_BASE_API_URL + '/api/items', {'Content-Type': 'application/json'})
    .then(response => {
      var item_selected = false;
      var fullData = response.data;
      var keysList = Object.keys(fullData)
      var responseLength = keysList.length;

      while (!item_selected) {

        var randPerks = Math.floor(Math.random() * responseLength);
        var selectedItem = fullData[keysList[randPerks]];

        if (selectedItem.isInNonViolentBuild) {
          this.setState({item: [selectedItem]})
          item_selected = true;
        }
      }

    })
    .catch((error) => {
      console.log(error)
    });

    //Get addon
    axios.get(process.env.REACT_APP_BASE_API_URL + '/api/itemaddons', {'Content-Type': 'application/json'})
      .then(response => {
        var addons = Object.values(response.data);
        var newAddons = []
        var selectedItem = this.state.item[0];

        for (var el of addons) {
          for (var parEl of el.parentItems) {
            if (parEl === selectedItem.id) {
              newAddons.push(el);
            }
          }
        }

        var two_addons = []
        var randInd = [Math.floor(Math.random() * newAddons.length), Math.floor(Math.random() * newAddons.length)];
        
        two_addons.push(newAddons[randInd[0]])
        two_addons.push(newAddons[randInd[1]])

        this.setState({addons: two_addons})
      
      })
      .catch((error) => {
        console.log(error)
      });

    //Get offering
    axios.get(process.env.REACT_APP_BASE_API_URL + '/api/offerings', {'Content-Type': 'application/json'})
      .then(response => {
        var offerings = Object.values(response.data);
        var item_selected = false;

        while (!item_selected) {

          var randInt = Math.floor(Math.random() * offerings.length);
          var offeringSelection = offerings[randInt];
  
          if (offeringSelection.isInNonViolentBuild) {
            this.setState({offering: [offeringSelection]})
            item_selected = true;
          }
        }
      
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

  itemList() {
    return this.state.item.map((selectedItem, i) => {
      return <Item item={selectedItem} key={i}/>;
    })
  }

  addonList() {
    return this.state.addons.map((addons, i) => {
      return <Addon addon={addons} key={i}/>;
    })
  }

  offeringList() {
    return this.state.offering.map((offering, i) => {
      return <Offering offering={offering} key={i}/>;
    })
  }

  render() {
    return (
      <Table striped bordered hover variant="dark">
      
      <thead>
        <tr>
          <th>Icon</th>
          <th>Perks</th>
          <th>Description</th>
          <th>Character</th>
        </tr>
      </thead>

      <tbody>
        { this.perksList() }
      </tbody>

            
      <thead>
        <tr>
          <th></th>
          <th>Item</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        { this.itemList() }
      </tbody>
            
      <thead>
        <tr>
          <th></th>
          <th>Addon</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
      { this.addonList() }
      </tbody>
            
      <thead>
        <tr>
          <th></th>
          <th>Offering</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
      { this.offeringList() }
      </tbody>

      </Table>
    );
  }
}