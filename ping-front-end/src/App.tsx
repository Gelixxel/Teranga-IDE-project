import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Editor from './components/Editor';
import Message from './components/Message';
import Login from './components/Login';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/" element={<Message />} />
        </Routes>
      </header>
    </div>
  );
};

export default App;
