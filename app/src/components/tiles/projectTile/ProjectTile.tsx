import React from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import './ProjectTile.scss';

interface ProjectTileProps {
  title: string;
  status: string;
  client: string;
  description: string;
  email: string;
  phone: string;
  rate: string;
}

const ProjectTile: React.FC<ProjectTileProps> = ({
  title,
  status,
  client,
  description,
  email,
  phone,
  rate,
}) => {
  return (
    <div className="project-tile">
      <div className="project-tile__header">
        <h3 className="project-tile__title">{title}</h3>
        <span className="project-tile__status">{status}</span>
      </div>
      <p className="project-tile__client">{client}</p>
      <p className="project-tile__description">{description}</p>
      <div className="project-tile__contact">
        <div className="project-tile__contact-item">
          <FaEnvelope className="project-tile__contact-icon" />
          <span>{email}</span>
        </div>
        <div className="project-tile__contact-item">
          <FaPhone className="project-tile__contact-icon" />
          <span>{phone}</span>
        </div>
      </div>
      <div className="project-tile__rate-info">
        <span className="project-tile__rate-label">Stawka</span>
        <span className="project-tile__rate-value">{rate}</span>
      </div>
    </div>
  );
};

export default ProjectTile;