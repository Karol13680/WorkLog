import React from 'react';
import { FaBriefcase, FaClock, FaCheckCircle, FaDollarSign } from 'react-icons/fa';
import InfoTile from "../../../../components/tiles/infoTile/InfoTile";
import TasksChart from "./TasksChart";
import './InfoSection.scss';

const InfoSection: React.FC = () => {
  const tileData = [
    {
      icon: <FaBriefcase />,
      title: 'Aktywne projekty',
      value: 4,
      percentageChange: 12,
    },
    {
      icon: <FaClock />,
      title: 'Przepracowany czas',
      value: 4,
      percentageChange: -12,
    },
    {
      icon: <FaCheckCircle />,
      title: 'Ukończone projekty',
      value: 4,
      percentageChange: 22,
    },
    {
      icon: <FaDollarSign />,
      title: 'Zysk',
      value: '4 542 zł',
      percentageChange: 15,
    },
  ];

  return (
    <section className="info-section">
      <div className="info-section__tiles">
        {tileData.map((tile, index) => (
          <InfoTile
            key={index}
            icon={tile.icon}
            title={tile.title}
            value={tile.value}
            percentageChange={tile.percentageChange}
          />
        ))}
      </div>
      <TasksChart />
    </section>
  );
};

export default InfoSection;