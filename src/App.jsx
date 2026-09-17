import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import LearningPage from "./pages/LearningPage";
import LearningCompletePage from "./pages/LearningCompletePage";
import KioskIdlePage from "./pages/KioskIdlePage";
import KioskInteractivePage from "./pages/KioskInteractivePage";
import KioskSelectionPage from "./pages/KioskSelectionPage";
import KioskFeedbackPage from "./pages/KioskFeedbackPage";
import ReportsPage from "./pages/ReportsPage";
import Practice from "./pages/Practice";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-neutral-950 font-sans antialiased">
          <Routes>
            {/* Public Home / Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Real Login Route */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Operator & Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'operator']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'operator']}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Protected General/Citizen/Operator Routes */}
            <Route
              path="/learning"
              element={
                <ProtectedRoute allowedRoles={['admin', 'operator', 'citizen']}>
                  <LearningPage />
                </ProtectedRoute>
              }
            />

            {/* Practice / Interactive module */}
            <Route
              path="/practice"
              element={
                <ProtectedRoute allowedRoles={['admin', 'operator', 'citizen']}>
                  <Navigate to="/practice/1" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'operator', 'citizen']}>
                  <Practice />
                </ProtectedRoute>
              }
            />

            {/* Learning Complete Pages */}
            <Route
              path="/learning-complete"
              element={
                <ProtectedRoute allowedRoles={['admin', 'operator', 'citizen']}>
                  <LearningCompletePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complete"
              element={
                <ProtectedRoute allowedRoles={['admin', 'operator', 'citizen']}>
                  <LearningCompletePage />
                </ProtectedRoute>
              }
            />

            {/* Kiosk Mode / Device flows - Public Interfaces */}
            <Route path="/kiosk-idle" element={<KioskIdlePage />} />
            <Route path="/kiosk-selection" element={<KioskSelectionPage />} />
            <Route path="/kiosk-interactive" element={<KioskInteractivePage />} />
            <Route path="/kiosk-feedback" element={<KioskFeedbackPage />} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}