import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsPlus } from "react-icons/bs";

import Header from "../../components/header/Header";
import ContentContainer from "../../components/contentContainer/ContentContainer";
import ProjectFilters from "../../components/filter/projectFilters/ProjectFilters";
import ClientFilters from "../../components/filter/clientFilters/ClientFilters";
import ProjectTile from "../../components/tiles/projectTile/ProjectTile";
import ClientTile from "../../components/tiles/clientTile/ClientTile";

import "./ProjectManagement.scss";

type ActiveTab = "projects" | "clients";

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

interface Client {
  id: number;
  name: string;
  description: string | null;
  email?: string | null;
  phone?: string | null;
  logo?: string | null;
}

const ProjectManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("projects");
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const isProjects = activeTab === "projects";
  const title = isProjects
    ? "Zarządzanie projektami"
    : "Zarządzanie klientami";

  const ActionButton: React.FC = () => (
    <Link to="/add-task" className="action-button">
      {activeTab === "projects" ? "Nowy projekt" : "Nowy klient"} <BsPlus />
    </Link>
  );

  // Pobieranie projektów
  useEffect(() => {
    if (isProjects) {
      const fetchProjects = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("access_token");
          if (!token) return;

          const response = await fetch("http://localhost:5000/jobs/all-user", {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });

          if (!response.ok) {
            console.error("Błąd pobierania projektów:", await response.text());
            return;
          }

          const data = await response.json();
          setProjects(data);
        } catch (error) {
          console.error("Błąd połączenia z API:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }
  }, [isProjects]);

  // Pobieranie klientów
  useEffect(() => {
    if (!isProjects) {
      const fetchClients = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("access_token");
          if (!token) return;

          const response = await fetch("http://localhost:5000/clients/all-user", {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });

          if (!response.ok) {
            console.error("Błąd pobierania klientów:", await response.text());
            return;
          }

          const data = await response.json();
          const formatted = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description || "Brak opisu",
            logo: c.logo || null,
            email: c.contact?.email || null,
            phone: c.contact?.phone || null,
          }));
          setClients(formatted);
        } catch (error) {
          console.error("Błąd połączenia z API:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchClients();
    }
  }, [isProjects]);

  return (
    <>
      <Header />
      <ContentContainer
        title={title}
        actionButton={<ActionButton />}
        tabs={
          <>
            <button
              className={`tab-button ${isProjects ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              Projekty
            </button>
            <button
              className={`tab-button ${!isProjects ? "active" : ""}`}
              onClick={() => setActiveTab("clients")}
            >
              Klienci
            </button>
          </>
        }
        filters={isProjects ? <ProjectFilters /> : <ClientFilters />}
      >
        <div className="projects-grid">
          {loading ? (
            <p>Ładowanie...</p>
          ) : isProjects ? (
            projects.length > 0 ? (
              projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/edit-task/${project.id}`}
                  className="project-link-wrapper"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ProjectTile {...project} />
                </Link>
              ))
            ) : (
              <p>Brak projektów przypisanych do użytkownika.</p>
            )
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <Link
                key={client.id}
                to={`/edit-client/${client.id}`}
                className="client-link-wrapper"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ClientTile
                  name={client.name}
                  description={client.description || "Brak opisu"}
                  email={client.email || ""}
                  phone={client.phone || ""}
                  logo={client.logo}
                />
              </Link>
            ))
          ) : (
            <p>Brak klientów przypisanych do użytkownika.</p>
          )}
        </div>
      </ContentContainer>
    </>
  );
};

export default ProjectManagement;
