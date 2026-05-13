import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsPlus } from "react-icons/bs";
import { useApi } from "../../api/useApi";

import Header from "../../components/header/Header";
import ContentContainer from "../../components/contentContainer/ContentContainer";
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
  description: string;
  email: string;
  phone: string;
  logo: string | null;
}

const ProjectManagement: React.FC = () => {
  const { api } = useApi();
  const [activeTab, setActiveTab] = useState<ActiveTab>("projects");
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const isProjects = activeTab === "projects";
  const title = isProjects ? "Zarządzanie projektami" : "Zarządzanie klientami";

  const ActionButton: React.FC = () => (
    <Link to="/add-task" className="action-button">
      {isProjects ? "Nowy projekt" : "Nowy klient"} <BsPlus />
    </Link>
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isProjects) {
          const data = await api("/jobs/all-user");
          setProjects(data);
        } else {
          const data = await api("/clients/all-user");
          
          const formattedClients = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description || "Brak opisu",
            logo: c.logo,
            email: c.contact?.email || "Brak e-mail",
            phone: c.contact?.phone || "Brak telefonu",
          }));
          setClients(formattedClients);
        }
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isProjects, api]);

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
              <p>Brak projektów.</p>
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
                  description={client.description}
                  email={client.email}
                  phone={client.phone}
                  logo={client.logo}
                />
              </Link>
            ))
          ) : (
            <p>Brak klientów.</p>
          )}
        </div>
      </ContentContainer>
    </>
  );
};

export default ProjectManagement;
