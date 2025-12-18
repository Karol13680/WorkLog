import React, { useState, useEffect, useRef } from 'react';
import './Stoper.scss';
import Header from '../../components/header/Header';
import InfoTile from '../../components/tiles/infoTile/InfoTile';
import ProjectTile from '../../components/tiles/projectTile/ProjectTile';
import TimeTracking from "./section/TimeTracking";
import RecentActivities from './section/RecentActivities';
import ManualEntry from './section/ManualEntry';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await fetch("/jobs/all-user", {
          headers: { "Authorization": `Bearer ${token}` },
          credentials: "include"
        });

        if (!response.ok) throw new Error("Nie udało się pobrać projektów");

        const data: Project[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Błąd pobierania projektów:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await fetch("/stats/dashboard", {
          headers: { "Authorization": `Bearer ${token}` },
          credentials: "include"
        });

        if (!response.ok) throw new Error("Nie udało się pobrać statystyk");

        const data: Stats = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Błąd pobierania statystyk:", error);
      }
    };

    fetchStats();
  }, [refreshKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleManualAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setSearchTerm(project.title);
    setIsDropdownVisible(false);
  };

  const formatTime = (totalHours: number) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours} h ${minutes} min`;
  };

  return (
    <>
      <Header />
      <main className="stoper-grid">
        <div className="grid-item item-timer">
          <TimeTracking key={refreshKey} selectedProjectId={selectedProject?.id || null} />
        </div>

        <div className="grid-item info-tiles-container">
          {stats ? (
            <>
              <InfoTile title={stats.active_projects.title} value={stats.active_projects.value} />
              <InfoTile title={stats.time_worked.title} value={formatTime(stats.time_worked.value)} />
              <InfoTile title={stats.completed_projects.title} value={stats.completed_projects.value} />
              <InfoTile title={stats.profit.title} value={stats.profit.value} />
            </>
          ) : (
            <p>Ładowanie statystyk...</p>
          )}
        </div>

        <div className="grid-item item-current">
          <div className="widget">
            <h3 className="widget__title">Aktualne zlecenie</h3>
            <div className="current-task__input-wrapper" ref={searchContainerRef}>
              <input
                type="text"
                placeholder="Wybierz projekt..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownVisible(true);
                  if (selectedProject && e.target.value !== selectedProject.title) {
                    setSelectedProject(null);
                  }
                }}
                onFocus={() => setIsDropdownVisible(true)}
              />
              {isDropdownVisible && filteredProjects.length > 0 && (
                <ul className="project-dropdown">
                  {filteredProjects.map(project => (
                    <li key={project.id} onClick={() => handleSelectProject(project)}>
                      {project.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedProject ? (
              <ProjectTile {...selectedProject} />
            ) : (
              <p className="widget__placeholder">Wybierz projekt z listy, aby rozpocząć...</p>
            )}
          </div>
        </div>

        <div className="grid-item item-recent">
          <RecentActivities key={refreshKey} />
        </div>

        <div className="grid-item item-manual">
          <ManualEntry onAdded={handleManualAdded} />
        </div>
      </main>
    </>
  );
};

export default Stoper;
