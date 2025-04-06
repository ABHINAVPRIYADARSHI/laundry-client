import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LSPList from "./components/LSPList";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderHistory from "./components/OrderHistory";
import MainLayout from "./components/MainLayout"; // Wrapper for shared UI like sidebar

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Route */}
        <Route
          path="/shops"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LSPList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
          <ProtectedRoute>
          <MainLayout>
          <OrderHistory />
          </MainLayout>
          </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
