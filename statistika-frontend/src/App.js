import "./App.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Graf from "./stranky/GrafPage.js";
import BotList from "./stranky/BotListPage.js";
import BotDetail from "./stranky/BotDetailPage";
import LoginPage from "./stranky/LoginPage";
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
            <Route exact path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
