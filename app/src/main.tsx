import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { plPL } from "@clerk/localizations";
import "./index.scss";

import Login from "./pages/access/Login.tsx";
import Registration from "./pages/access/Registration.tsx";
import WorkLog from "./pages/home/WorkLog.tsx";
import Stoper from "./pages/stoper/Stoper.tsx";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement.tsx";
import Summary from "./pages/summary/Summary.tsx";
import AddTask from "./pages/addTask/AddTask.tsx";
import EditTask from "./pages/editTask/EditTask.tsx";
import EditClient from "./pages/editClient/EditClient.tsx";

import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import PublicRoute from "./routes/PublicRoute.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={plPL}>
      <BrowserRouter>
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
          <Route
            path="/edit-task/:id"
            element={
              <ProtectedRoute>
                <EditTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-client/:id"
            element={
              <ProtectedRoute>
                <EditClient />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);