import React, { Component } from 'react';
import './App.css';
import { google_api_key } from './config';

class App extends Component {

  state = { url : "https://www.google.com/maps/embed/v1/place?q=...&key=" + google_api_key }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Geohash Thingy</h2>
          <div display="inline">
            <input name="new" type="text" value={this.state.value}
            onChange={this.handleChange.bind(this)}
            ></input>
            <button onClick={this.clickHandle.bind(this)}>Go!</button>
          </div>
          <p name="place">Please Select a Place</p>
          <iframe
            title="maps"
            width="600"
            height="450"
            frameBorder="0"
            style={{border:0}}
            src={this.state.url}
            allowFullScreen>
          </iframe>
        </header>
      </div>
    );
  }
  handleChange(e){
    this.setState({ value: e.target.value });
    console.log(this.state);
  }
  clickHandle(place){;
    this.setState({url: "https://www.google.com/maps/embed/v1/place?q="+this.state.value+"&key=" + google_api_key});
  }
}

export default App;
