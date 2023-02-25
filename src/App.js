import logo from './logo.svg';
import './App.css';
<<<<<<< HEAD
import React, { Component } from "react";
import { render } from "react-dom";

function App() extends Component{
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          loaded: false,
          placeholder: "Loading"
        };
      }

      componentDidMount() {
        fetch("api/students")
          .then(response => {
            if (response.status > 400) {
              return this.setState(() => {
                return { placeholder: "Something went wrong!" };
              });
            }
            return response.json();
          })
          .then(data => {
            this.setState(() => {
              return {
                data,
                loaded: true
              };
            });
          });
      }
render() {
    return (
      <ul>
        {this.state.data.map(contact => {
          return (
            <li>
              {contact.item_name}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
=======

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
>>>>>>> c91572a638f673ae0ee047a09e7a1f2863da9262
