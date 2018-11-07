import React, { Component } from 'react';
import './App.css';
import { google_api_key } from './config';

var geohash = require('ngeohash');
var https = require('https');

class App extends Component {


  state = {
    embed_url : "https://www.google.com/maps/embed/v1/place?q=...&key=" + google_api_key,
    json_url: "https://maps.googleapis.com/maps/api/geocode/json?address=...&key=" + google_api_key,
    loc : "",
    geodata: {}
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Geohash Thingy</h2>
          <div display="inline">
            <input name="new" type="text" value={this.state.value}
            onChange={this.locUpdate.bind(this)}
            ></input>
            <button onClick={this.geoUpdate.bind(this)}>Go!</button>
          </div>
          <p name="place">Please Select a Place</p>
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
  locUpdate(e){
    this.setState({ loc: e.target.value });
    console.log(this.state);
  }

  geoUpdate(e){
    this.updateMap(e);
    this.locQuery(e);
  }
  updateMap(e){
    this.setState({embed_url: "https://www.google.com/maps/embed/v1/place?q="+this.state.loc+"&key=" + google_api_key});
  }
  locQuery(e){
    this.state.json_url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.loc + "&key=" + google_api_key
    var geodata = {};
    https.get(this.state.json_url, (response) => {
      var data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', ()=> {
        geodata = JSON.parse(data);
        console.log(geodata);

      });
    }).on("error", (err) => {
      console.log(err.message);
    });
  }
}

export default App;
