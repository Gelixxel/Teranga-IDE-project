import React, { useState } from 'react';
import "./App.css";
import Editor from "./components/Editor";
import Message from "./components/Message";
import PopupParam from './components/PopupParam';
// import Terminal from "./components/Terminal";

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleParam = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Message />
        {/* <p>ceci est un message du front end: caca</p> */}
        <Editor />
        <button onClick={toggleParam}>
          Parameters
        </button>
        {isOpen && <PopupParam onClosePopup={toggleParam}/>}
      </header>
    </div>
  );

};

export default App;
