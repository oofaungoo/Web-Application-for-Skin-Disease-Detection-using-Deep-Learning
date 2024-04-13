import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';
import Home from "./pages/Home/Home"
import Upload from "./pages/Upload/Upload"
import Wait from "./pages/Wait/Wait"
import Result from "./pages/Result/Result"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/wait" element={<Wait />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  </BrowserRouter>
);
