// This file decides which page to show based on the web address (URL).

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import ProductList from "./pages/ProductList.jsx";
import RecordSale from "./pages/RecordSale.jsx";
import ManageStaff from "./pages/ManageStaff.jsx";

// This little helper checks: "does this person have a login token?"
// If not, send them back to the Login page instead of letting them in.
function RequireLogin({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/products"
        element={
          <RequireLogin>
            <ProductList />
          </RequireLogin>
        }
      />

      <Route
        path="/sale"
        element={
          <RequireLogin>
            <RecordSale />
          </RequireLogin>
        }
      />

       <Route path="/staff" element={ <RequireLogin> <ManageStaff /> </RequireLogin> } />

      {/* If someone visits any other web address, send them to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
