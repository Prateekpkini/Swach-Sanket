import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { I18nProvider } from "./i18n/I18nProvider";
import LanguageSwitcher from "./components/LanguageSwitcher";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ZillaDashboard from "./pages/ZillaDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import ExampleDashboard from "./pages/ExampleDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <I18nProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {/* Global language switcher visible on all pages */}
          <LanguageSwitcher />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/zilla-dashboard"
              element={
                <ProtectedRoute>
                  <ZillaDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver-dashboard"
              element={
                <ProtectedRoute>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/example-dashboard"
              element={
                <ProtectedRoute>
                  <ExampleDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
