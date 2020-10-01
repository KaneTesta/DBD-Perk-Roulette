import React, { Component } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
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
      <tbody>
        <tr>
          <td><img src={props.perk.icon} alt={props.perk.perk_name}></img></td>
          <td>{props.perk.perk_name}</td>
          <td>{props.perk.description}</td>
          <td>{props.perk.name}</td>
        </tr>
      </tbody>
    </Table>
  </FadeIn>
)

const Item = item => (
  <FadeIn>
    <Table striped bordered hover variant="dark">
    <tbody>
      <tr>
        <td><img src={`https://dbd-stats.info/data/Public/${item.item.iconPathList[0]}`} alt="" /></td>
        <td>{item.item.displayName}</td>
        <td dangerouslySetInnerHTML={{__html: item.item.description}}></td>
        <td></td>
      </tr>
    </tbody>
    </Table>
  </FadeIn>
)

const Offering = offering => (
  <FadeIn>
    <Table striped bordered hover variant="dark">
    <tbody>
      <tr>
      <td><img src={`https://dbd-stats.info/data/Public/${offering.offering.iconPathList[0]}`} alt="" /></td>
        <td>{offering.offering.displayName}</td>
        <td dangerouslySetInnerHTML={{__html: offering.offering.description}}></td>
        <td></td>
      </tr>
    </tbody>
    </Table>
  </FadeIn>
)


export default class KillerRandomPerks extends Component {
  
  constructor(props) {
    super(props);

    this.state = {perks: [], item: [], offering: [], loading: true };
  }

  componentDidMount() {

    //Build Random Perks
    trackPromise(axios.get(process.env.REACT_APP_BASE_API_URL + '/perks?lang=en&role=Killer&is_ptb=false', {'Content-Type': 'application/json'})
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

        if (!selectedItem.isInNonViolentBuild) {
          this.setState({item: [selectedItem]})
          item_selected = true;
        }
      }

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
  
          if (!offeringSelection.isInNonViolentBuild) {
            this.setState({offering: [offeringSelection]})
            item_selected = true;
            this.setState({loading: false})
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
        <h2>Item</h2>
        <LoadingIndicator/>
        { this.itemList() }
        <h2>Offering</h2>
        <LoadingIndicator/>
        { this.offeringList() }
    </div>
    );
  }
}