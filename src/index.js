import React from "react";
import { render } from "react-dom";
import Game from "./Game";

class App extends React.Component {
  render() {
    return <Game />;
  }
}

render(<App />, document.getElementById("root"));
