import React from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import './ClientTile.scss';

interface ClientTileProps {
  name: string;
  description: string;
  email: string;
  phone: string;
  logo?: string | null; 
}

const ClientTile: React.FC<ClientTileProps> = ({ name, description, email, phone, logo }) => {
  return (
    <div className="client-tile">
      {logo && (
        <div className="client-tile__logo">
          <img
            src={`/${logo}`}
            alt={`${name} logo`}
            className="client-tile__logo-img"
          />
        </div>
      )}

      <div className="client-tile__background" />
      <div className="client-tile__content">
        <h3 className="client-tile__name">{name}</h3>
        <p className="client-tile__description">{description}</p>

        <div className="client-tile__contact">
          {email && (
            <div className="client-tile__contact-item">
              <FaEnvelope className="client-tile__contact-icon" />
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="client-tile__contact-item">
              <FaPhone className="client-tile__contact-icon" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientTile;
