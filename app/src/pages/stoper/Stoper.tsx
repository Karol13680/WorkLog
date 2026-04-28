import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../../api/useApi'; // Import Twojego hooka

import Header from '../../components/header/Header';
import InfoTile from '../../components/tiles/infoTile/InfoTile';
import ProjectTile from '../../components/tiles/projectTile/ProjectTile';
import TimeTracking from "./section/TimeTracking";
import RecentActivities from './section/RecentActivities';
import ManualEntry from './section/ManualEntry';

import './Stoper.scss';

interface Project {
  id: number;
  title: string;
  status: string;
  client: string;
  description: string;
  email: string;
  phone: string;
  rate: string;
}

interface Stats {
  active_projects: { title: string; value: number };
  time_worked: { title: string; value: number };
  completed_projects: { title: string; value: number };
  profit: { title: string; value: string };
}

const Stoper: React.FC = () => {
  const { api } = useApi(); // Inicjalizacja automatu
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // api() samo zadba o token dla obu zapytań w Promise.all
        const [projectsData, statsData] = await Promise.all([
          api("/jobs/all-user"),
          api("/stats/dashboard")
        ]);

        setProjects(projectsData || []);
        setStats(statsData);
      } catch (error) {
        console.error("Błąd pobierania danych w stoperze:", error);
      }
    };
    fetchData();
  }, [refreshKey]); // Usunięto getToken z zależności

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDataRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const filteredProjects = searchTerm === "" 
    ? projects 
    : projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setSearchTerm(project.title);
    setIsDropdownVisible(false);
  };

  return (
    <>
      <Header />
      <main className="stoper-grid">
        
        <div className="grid-item item-timer">
          <TimeTracking 
            selectedProjectId={selectedProject?.id || null} 
            onStop={handleDataRefresh} 
          />
        </div>

        <div className="grid-item info-tiles-container">
          {stats ? (
            <>
              <InfoTile title={stats.active_projects.title} value={stats.active_projects.value} />
              <InfoTile title={stats.time_worked.title} value={`${stats.time_worked.value} h`} />
              <InfoTile title={stats.completed_projects.title} value={stats.completed_projects.value} />
              <InfoTile title={stats.profit.title} value={stats.profit.value} />
            </>
          ) : (
            <div className="loading-stats">Pobieranie danych...</div>
          )}
        </div>

        <div className="grid-item item-current">
          <div className="widget current-task">
            <h3 className="widget__title">Aktualne zlecenie</h3>
            
            <div className="current-task__search-container" ref={searchContainerRef}>
              <div className="current-task__input-wrapper">
                <input
                  type="text"
                  className="current-task__search-input"
                  placeholder="Kliknij, aby wybrać projekt..."
                  value={searchTerm}
                  onFocus={() => setIsDropdownVisible(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownVisible(true);
                    if (selectedProject && e.target.value !== selectedProject.title) {
                      setSelectedProject(null);
                    }
                  }}
                />
              </div>

              {isDropdownVisible && (
                <ul className="current-task__dropdown">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                      <li 
                        key={project.id} 
                        className="current-task__dropdown-item"
                        onClick={() => handleSelectProject(project)}
                      >
                        <div className="project-info">
                          <span className="project-name">{project.title}</span>
                          <span className="project-client">{project.client}</span>
                        </div>
                        <span className="project-rate">{project.rate}</span>
                      </li>
                    ))
                  ) : (
                    <li className="current-task__dropdown-empty">Nie znaleziono projektu</li>
                  )}
                </ul>
              )}
            </div>

            <div className="current-task__preview">
              {selectedProject ? (
                <ProjectTile {...selectedProject} />
              ) : (
                <div className="current-task__placeholder">
                  <p>Wybierz projekt z listy powyżej, aby aktywować stoper.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid-item item-recent">
          <RecentActivities key={`recent-${refreshKey}`} />
        </div>

        <div className="grid-item item-manual">
          <ManualEntry onAdded={handleDataRefresh} />
        </div>

      </main>
    </>
  );
};

export default Stoper;