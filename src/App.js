import React, { Component } from 'react';
import './App.css';
import { google_api_key } from './config';

var geohash = require('ngeohash');
var https = require('https');

class App extends Component {


  state = {
    embed_url : encodeURI("https://www.google.com/maps/embed/v1/place?q=...&key=" + google_api_key),
    json_url: encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=...&key=" + google_api_key),
    loc_input: '',
    loc : '',
    geodata: {},
    geohash_input: '',
    geohash: ''
  }

  render() {
    let geodiv, hash;
    if (this.state.geodata.status === "OK" && this.state.geodata.results) {
      geodiv = <div>
        { this.state.geodata.results[0].formatted_address }
      </div>;
      hash = <div>
        Geohash: { this.state.geohash }
      </div>;
    }
    //console.log(geodiv);
    return (
      <div className="App">
        <header className="App-header">
          <h2>Geohash Thingy</h2>
          <div width="125px">
            <div style={{"font-size":"10px","line-height":"1px","text-align":"left"}}>
            Place name
            </div>
            <div display="inline">
              <input name="place" type="text" value={this.state.value}
              onChange={this.locUpdate.bind(this)}
              ></input>
              <button onClick={this.geoUpdate.bind(this)}>Go!</button>
            </div>
          </div>
          <div width="125px">
            <div style={{"font-size":"10px","line-height":"1px","text-align":"left","margin-top":"10px"}}>
            Geohash
            </div>
            <div display="inline">
              <input name="geohash" type="text" value={this.state.value}
              onChange={this.hashUpdate.bind(this)}
              ></input>
              <button onClick={this.geoUpdate.bind(this)}>Go!</button>
            </div>
          </div>
          <p name="place">Please Select a Place or Input a Geohash</p>
          {geodiv}
          {hash}
          <iframe
            title="maps"
            width="600"
            height="450"
            frameBorder="0"
            style={{border:0}}
            src={this.state.embed_url}
            allowFullScreen>
          </iframe>
        </header>
      </div>
    );
  }
  stateReset(full) {
    var init_state = {
      embed_url : encodeURI("https://www.google.com/maps/embed/v1/place?q=...&key=" + google_api_key),
      json_url: encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=...&key=" + google_api_key),
      loc: '',
      geodata: {},
      geohash: ''
    };

    if (full) {
      init_state.loc_input = '';
      init_state.geohash = '';
    }

    this.setState(init_state);
  }
  locUpdate(e){
    this.setState({ loc_input: e.target.value });
  }
  hashUpdate(e){
    this.setState({ geohash_input: e.target.value });
    console.log(this.state);
  }
  geoUpdate(e){
    this.stateReset();
    this.updateMap(e);
    this.locQuery(e);
  }
  updateMap(e){
    var embed_url = encodeURI("https://www.google.com/maps/embed/v1/place?q="+this.state.loc_input +"&key=" + google_api_key);
    this.setState({embed_url: embed_url});
  }
  locQuery(e){
    var json_url = encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.loc_input + "&key=" + google_api_key);
    var geodata = {};
    https.get(json_url, (response) => {
      var data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', ()=> {
        geodata = JSON.parse(data);

        if (geodata.status === "OK" && geodata.results) {
          var suspect_loc = geodata.results[0];
          var coordinates = suspect_loc.geometry.location;
          //console.log(coordinates);
          var newhash = geohash.encode(coordinates.lat, coordinates.lng, 12);
          var address = {};

          this.setState({
            json_url: json_url,
            geodata: geodata,
            geohash: newhash
          });
          console.log(this.state);
        }
        //console.log(geodata);

      });
    }).on("error", (err) => {
      console.log(err.message);
    });
  }
}



export default App;
