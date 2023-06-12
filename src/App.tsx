import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoutesApp from "./routes";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RoutesApp />} />
      </Routes>
    </BrowserRouter></>
  );
}

export default App;
