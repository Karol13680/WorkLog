import React from 'react';
import './InfoTile.scss';

interface InfoTileProps {
  title: string;
  value: string | number;
}

const InfoTile: React.FC<InfoTileProps> = ({ title, value }) => {
  return (
    <div className="info-tile">
      <div className="info-tile__title">{title}</div>
      <div className="info-tile__value-wrapper">
        <div className="info-tile__value">{value}</div>
      </div>
    </div>
  );
};

export default InfoTile;
