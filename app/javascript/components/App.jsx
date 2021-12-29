import React, { useRef, useState } from "react";
import api from "../helpers/api";
import Desktop from "./Desktop";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/desktop" element={<Desktop />} />
      </Routes>
    </Router>
  );
};

export default App;
