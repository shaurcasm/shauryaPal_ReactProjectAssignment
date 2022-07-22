import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Landing from './components/Landing';
import MovieDetailed from './components/MovieDetailed';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App h-100 d-flex flex-column">
      <div className="App-header">
        <span>
          <img id='logo' src='images/movie-coupon.svg' alt='logo' style={{ width: '150px', height: '100px'}} />
        </span>
        <h1 className="App-title">Movies on the Tip</h1>
      </div>
      
      <Routes>
        <Route path="/" element={<Navigate to="movies" replace />} />
        <Route path="movies" element={<Landing />} />
        <Route path="movies/:category/:id" element={<MovieDetailed />} />
      </Routes>
    </div>
  );
}

export default App;
