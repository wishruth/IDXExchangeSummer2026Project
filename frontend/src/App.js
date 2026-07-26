import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListingsPage from './pages/ListingsPage';
import PropertyDetail from './pages/PropertyDetail'; // We will create this next

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main search grid */}
          <Route path="/" element={<ListingsPage />} />
          
          {/* Dynamic route for individual property details */}
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;