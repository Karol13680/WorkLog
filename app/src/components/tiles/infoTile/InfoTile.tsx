import React from 'react';
import './InfoTile.scss';

interface InfoTileProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  percentageChange?: number | null;
}

const InfoTile: React.FC<InfoTileProps> = ({ title, value, icon, percentageChange }) => {
  return (
    <div className="info-tile">
      <div className="info-tile__header">
        <div className="info-tile__icon">{icon}</div>
        {percentageChange !== null && percentageChange !== undefined && (
          <div className={`info-tile__trend ${percentageChange >= 0 ? 'positive' : 'negative'}`}>
            {percentageChange}%
          </div>
        )}
      </div>
      <div className="info-tile__content">
        <div className="info-tile__title">{title}</div>
        <div className="info-tile__value">{value}</div>
      </div>
    </div>
  );
};

export default InfoTile;