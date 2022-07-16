import "./App.css";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Graf from "./Graf.js";
import BotList from "./BotList.js";
import BotDetail from "./BotDetail";
import Header from "./Header";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="Content">
          <Routes>
            <Route exact path="/" element={<Graf />} />
            <Route exact path="/bot-list" element={<BotList />} />
            <Route exact path="/bot-detail/:botId" element={<BotDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
