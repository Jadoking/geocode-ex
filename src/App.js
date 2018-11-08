import React, { Component } from 'react';
import './App.css';
import { google_api_key } from './config';

var geohash = require('ngeohash');
var https = require('https');

class App extends Component {


  state = {
    embed_url : encodeURI("https://www.google.com/maps/embed/v1/place?q=...&key=" + google_api_key),
    loc_input: '',
    loc : '',
    geodata: {},
    geohash_input: '',
    geohash: ''
  }

  componentDidMount(){
    document.title = "Gecoder"
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
              onChange={this.dataUpdate.bind(this)} data="potato"
              ></input>
              <button data-type="loc" onClick={this.geoUpdate.bind(this)}>Go!</button>
            </div>
          </div>
          <div width="125px">
            <div style={{"font-size":"10px","line-height":"1px","text-align":"left","margin-top":"10px"}}>
            Geohash
            </div>
            <div display="inline">
              <input name="geohash" type="text" value={this.state.value}
              onChange={this.dataUpdate.bind(this)}
              ></input>
              <button data-type="geo" onClick={this.geoUpdate.bind(this)}>Go!</button>
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
  dataUpdate(e, type){
    var target = e.target;
    if (target.name === "place") {
      this.setState({ loc_input: e.target.value });
    } else if (target.name === "geohash") {
      this.setState({ geohash_input: e.target.value });
    }
  }
  geoUpdate(e){
    this.stateReset();
    this.updateMap(e, e.target.getAttribute('data-type'));
    this.locQuery(e, e.target.getAttribute('data-type'));
  }
  updateMap(e, type){
    var embed_url;
    if (type === "loc") {
      embed_url = encodeURI("https://www.google.com/maps/embed/v1/place?q="+ this.state.loc_input +"&key=" + google_api_key);
    } else if (type === "geo") {
      var coordinates = geohash.decode(this.state.geohash_input);
      embed_url = encodeURI("https://www.google.com/maps/embed/v1/place?q="+ coordinates.latitude + "," + coordinates.longitude +"&key=" + google_api_key);
    }
    this.setState({embed_url: embed_url});
  }
  locQuery(e, type){
    var json_url, coordinates;
    if (type === "loc") {
      json_url = encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.loc_input + "&key=" + google_api_key);
    } else if (type === "geo") {
      coordinates = geohash.decode(this.state.geohash_input);
      json_url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coordinates.latitude + "," + coordinates.longitude + "&key=" + google_api_key;
    }
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
          var hash;
          if (type === "loc") {
            coordinates = suspect_loc.geometry.location;
            hash = geohash.encode(coordinates.lat, coordinates.lng, 12);
          } else {
            hash = this.state.geohash_input;
          }

          this.setState({
            geodata: geodata,
            geohash: hash
          });
        }
        //console.log(geodata);

      });
    }).on("error", (err) => {
      console.log(err.message);
    });
  }
}



export default App;
