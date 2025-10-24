import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.scss'

import Login from "./pages/access/Login.tsx";
import Registration from "./pages/access/Registration.tsx";
import WorkLog from "./pages/home/WorkLog.tsx";
import Stoper from './pages/stoper/Stoper.tsx';
import ProjectManagement from './pages/ProjectManagement/ProjectManagement.tsx';
import Summary from './pages/summary/Summary.tsx';

import AddTask from './pages/addTask/AddTask.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkLog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/stoper" element={<Stoper />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/add-task" element={<AddTask />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
