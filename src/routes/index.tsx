import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";
import { Chat } from "../pages/Chat";

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default RoutesApp;
