import React from "react";
import "./App.css";
import Editor from "./components/Editor";
import Message from "./components/Message";
// import Terminal from "./components/Terminal";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Message />
        {/* <p>ceci est un message du front end: caca</p> */}
        <Editor />
      </header>
    </div>
  );
};

export default App;
