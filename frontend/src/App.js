import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import PricesPage from './pages/PricesPage';
import TrendsPage from './pages/TrendsPage';
import NewsPage from './pages/NewsPage';
import FeaturesPage from './pages/FeaturesPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/features" element={<FeaturesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
