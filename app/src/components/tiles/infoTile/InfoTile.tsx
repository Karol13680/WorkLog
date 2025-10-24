import React from 'react';
import './InfoTile.scss';

interface InfoTileProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  percentageChange?: number;
  showDollarIcon?: boolean;
}

const InfoTile: React.FC<InfoTileProps> = ({
  icon,
  title,
  value,
  percentageChange,
  showDollarIcon = false,
}) => {
  const isPositive = percentageChange && percentageChange >= 0;
  const percentageClass = percentageChange
    ? isPositive
      ? 'info-tile__percentage--positive'
      : 'info-tile__percentage--negative'
    : '';

  return (
    <div className="info-tile">
      <div className="info-tile__header">
        <div className="info-tile__icon-wrapper">{icon}</div>
        {percentageChange !== undefined && (
          <div className={`info-tile__percentage ${percentageClass}`}>
            {isPositive ? `+${percentageChange}%` : `${percentageChange}%`}
          </div>
        )}
      </div>
      <div className="info-tile__title">{title}</div>
      <div className="info-tile__value-wrapper">
        <div className="info-tile__value">{value}</div>
        {showDollarIcon && <div className="info-tile__dollar-icon">$</div>}
      </div>
    </div>
  );
};

export default InfoTile;