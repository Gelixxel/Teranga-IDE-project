import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Editor from './components/Editor';
import Message from './components/Message';
import PopupParam from './components/PopupParam';
import Login from './components/Login';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleParam = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/" element={<Message />} />
        </Routes>
        <button onClick={toggleParam}>
          Parameters
        </button>
        {isOpen && <PopupParam onClosePopup={toggleParam} />}
      </header>
    </div>
  );
};

export default App;
