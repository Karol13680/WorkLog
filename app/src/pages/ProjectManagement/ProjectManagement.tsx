import React, { useState } from 'react';

import Header from '../../components/header/Header';
import ContentContainer from "../../components/contentContainer/ContentContainer";
import ProjectFilters from "../../components/filter/projectFilters/ProjectFilters";
import ClientFilters from "../../components/filter/clientFilters/ClientFilters";
import ProjectTile from "../../components/tiles/projectTile/ProjectTile";
import ClientTile from '../../components/tiles/clientTile/ClientTile';

import './ProjectManagement.scss';
import { Link } from 'react-router-dom';
import { BsPlus } from 'react-icons/bs';

type ActiveTab = 'projects' | 'clients';

const mockProjects = [
  { title: "Rebranding", status: "W trakcie", client: "Tech Corp Solutions", description: "Stworzenie nowego logo...", email: "email@techcorp.com", phone: "+48 111 222 333", rate: "50 zł/h" },
];
const mockClients = [
    { name: "TechCorp Solutions", description: "Lider branży spożywczej w Polsce", email: "email@techcorp.com", phone: "+48 111 222 333" },
];

const ProjectManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('projects');
  
  const isProjects = activeTab === 'projects';
  const title = isProjects ? "Zarządzanie projektami" : "Zarządzanie zleceniami klientów";
  // const buttonLabel = isProjects ? "Nowy projekt" : "Dodaj klienta";

  const ActionButton: React.FC = () => (
    <Link to="/add-task" className="action-button">
      {activeTab === 'projects' ? 'Nowy projekt' : 'Nowy klient'} <BsPlus />
    </Link>
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
              className={`tab-button ${isProjects ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projekty
            </button>
            <button
              className={`tab-button ${!isProjects ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              Klienci
            </button>
          </>
        }

        filters={isProjects ? <ProjectFilters /> : <ClientFilters />}
      >
        <div className="projects-grid">
          {isProjects
            ? mockProjects.map((project, index) => (
                <ProjectTile key={index} {...project} />
              ))
            : mockClients.map((client, index) => (
                <ClientTile key={index} {...client} />
              ))}
        </div>
      </ContentContainer>
    </>
  );
};

export default ProjectManagement;