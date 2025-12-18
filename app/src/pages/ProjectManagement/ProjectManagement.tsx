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

  // ✅ Filtrowanie i wyszukiwarka
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const isProjects = activeTab === "projects";
  const title = isProjects ? "Zarządzanie projektami" : "Zarządzanie klientami";

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

          const response = await fetch("/jobs/all-user", {
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

          const response = await fetch("/clients/all-user", {
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

  // ✅ Filtrowanie projektów
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = selectedClient ? p.client === selectedClient : true;
    const matchesStatus = selectedStatus ? p.status === selectedStatus : true;
    return matchesSearch && matchesClient && matchesStatus;
  });

  // ✅ Filtrowanie klientów
  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        filters={
          isProjects ? (
            <ProjectFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
          ) : (
            <ClientFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          )
        }
      >
        <div className="projects-grid">
          {loading ? (
            <p>Ładowanie...</p>
          ) : isProjects ? (
            filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
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
              <p>Brak projektów spełniających kryteria.</p>
            )
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
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
            <p>Brak klientów spełniających kryteria.</p>
          )}
        </div>
      </ContentContainer>
    </>
  );
};

export default ProjectManagement;
