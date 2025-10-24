import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.scss";

import Login from "./pages/access/Login.tsx";
import Registration from "./pages/access/Registration.tsx";
import WorkLog from "./pages/home/WorkLog.tsx";
import Stoper from "./pages/stoper/Stoper.tsx";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement.tsx";
import Summary from "./pages/summary/Summary.tsx";
import AddTask from "./pages/addTask/AddTask.tsx";

import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import PublicRoute from "./routes/PublicRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Registration />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <WorkLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stoper"
            element={
              <ProtectedRoute>
                <Stoper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <Summary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
