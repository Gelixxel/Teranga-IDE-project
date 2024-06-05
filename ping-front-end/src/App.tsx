import React from "react";
import "./App.css";
import Editor from "./components/Editor";
import Message from "./components/Message";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Message/>
        <Editor />
      </header>
    </div>
  );
};

export default App;
