import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { IssueDetailsPage } from './pages/IssueDetailsPage';
import { CommunityMapPage } from './pages/CommunityMapPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageComplaintsPage } from './pages/ManageComplaintsPage';
import { DuplicatesReviewPage } from './pages/DuplicatesReviewPage';
import { AnalyticsReportsPage } from './pages/AnalyticsReportsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Standalone Landing Page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Application Main Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Citizen & Shared Routes */}
              <Route path="/dashboard" element={<CitizenDashboard />} />
              <Route path="/report" element={<ReportIssuePage />} />
              <Route path="/issues/:id" element={<IssueDetailsPage />} />
              <Route path="/map" element={<CommunityMapPage />} />
              <Route path="/profile" element={<ProfileSettingsPage />} />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <ProtectedRoute requireAdmin>
                    <ManageComplaintsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/duplicates"
                element={
                  <ProtectedRoute requireAdmin>
                    <DuplicatesReviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requireAdmin>
                    <AnalyticsReportsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Custom 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
