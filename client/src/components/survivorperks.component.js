import React, { Component } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table'
import { trackPromise } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import { usePromiseTracker } from "react-promise-tracker";
import FadeIn from 'react-fade-in';

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress && 
    <div
      style={{
        width: "90%",
        height: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "40px"
      }}
    >
    <Loader type="Oval" color="#ff0000" />
    </div>
};

const Perk = props => (
  <FadeIn>
    <Table striped bordered hover variant="dark">
    <tr>
      <td><img src={props.perk.icon} alt={props.perk.perk_name}></img></td>
      <td>{props.perk.perk_name}</td>
      <td>{props.perk.description}</td>
      <td>{props.perk.name}</td>
    </tr>
    </Table>
  </FadeIn>
)

const Item = item => (
  <FadeIn>
    <Table striped bordered hover variant="dark">
    <tr>
    <td><img src={`https://dbd-stats.info/data/Public/${item.item.iconPathList[0]}`} alt="" /></td>
      <td>{item.item.displayName}</td>
      <td dangerouslySetInnerHTML={{__html: item.item.description}}></td>
      <td></td>
    </tr>
    </Table>
  </FadeIn>
)

const Addon = addon => (
  <FadeIn>
    <Table striped bordered hover variant="dark">
    <tr>
    <td><img src={`https://dbd-stats.info/data/Public/${addon.addon.iconPathList[0]}`} alt="" /></td>
      <td>{addon.addon.displayName}</td>
      <td dangerouslySetInnerHTML={{__html: addon.addon.description}}></td>
      <td></td>
    </tr>
    </Table>
  </FadeIn>
)

const Offering = offering => (
  <FadeIn>
    <Table striped bordered hover variant="dark">
    <tr>
    <td><img src={`https://dbd-stats.info/data/Public/${offering.offering.iconPathList[0]}`} alt="" /></td>
      <td>{offering.offering.displayName}</td>
      <td dangerouslySetInnerHTML={{__html: offering.offering.description}}></td>
      <td></td>
    </tr>
    </Table>
  </FadeIn>
)


export default class SurvivorRandomPerks extends Component {
  
  constructor(props) {
    super(props);

    this.state = {perks: [], item: [], addons: [], offering: []};
  }

  componentDidMount() {

    //Build Random Perks
    trackPromise(axios.get(process.env.REACT_APP_BASE_API_URL + '/perks?lang=en&role=Survivor&is_ptb=false', {'Content-Type': 'application/json'})
    .then(response => {

      var fullData = response.data;
      var responseLength = fullData.length;
      var randPerks = [Math.floor(Math.random() * responseLength), Math.floor(Math.random() * responseLength), Math.floor(Math.random() * responseLength), Math.floor(Math.random() * responseLength)];

      var selectedPerks = [fullData[randPerks[0]], fullData[randPerks[1]], fullData[randPerks[2]], fullData[randPerks[3]]]

      this.setState({perks: selectedPerks})
    })
    .catch((error) => {
      console.log(error)
    }));

    //Build random Items
    trackPromise(axios.get(process.env.REACT_APP_BASE_API_URL + '/api/items', {'Content-Type': 'application/json'})
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
    }));

    //Get addon
    trackPromise(axios.get(process.env.REACT_APP_BASE_API_URL + '/api/itemaddons', {'Content-Type': 'application/json'})
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
      }));

    //Get offering
    trackPromise(axios.get(process.env.REACT_APP_BASE_API_URL + '/api/offerings', {'Content-Type': 'application/json'})
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
      }));
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
      <div>
        <h2>Perks</h2>
        <LoadingIndicator/>
        { this.perksList() }
        <h2>Items</h2>
        <LoadingIndicator/>
        { this.itemList() }
        <h2>Addons</h2>
        <LoadingIndicator/>
        { this.addonList() }
        <h2>Offerings</h2>
        <LoadingIndicator/>
        { this.offeringList() }
      </div>
    );
  }
}