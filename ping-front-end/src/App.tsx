import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Editor from './components/Editor';
import BreakPage from './components/BreakPage';
import Message from './components/Message';
import Login from './components/Login';

const App: React.FC = () => {

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/break" element={<BreakPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </header>
    </div>
  );
};

export default App;
