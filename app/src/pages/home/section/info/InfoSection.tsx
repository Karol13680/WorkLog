import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaClock, FaCheckCircle, FaDollarSign } from 'react-icons/fa';
import InfoTile from "../../../../components/tiles/infoTile/InfoTile";
import TasksChart from "./TasksChart";
import './InfoSection.scss';

interface StatItem {
  title: string;
  value: string | number;
  percentageChange: number | null;
}

interface DashboardStats {
  active_projects: StatItem;
  time_worked: StatItem;
  completed_projects: StatItem;
  profit: StatItem;
}

const InfoSection: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('/stats/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error("Błąd pobierania statystyk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="info-section__loading">Ładowanie statystyk...</div>;
  }

  const tileConfig = [
    { key: 'active_projects', icon: <FaBriefcase />, data: stats.active_projects },
    { key: 'time_worked', icon: <FaClock />, data: stats.time_worked },
    { key: 'completed_projects', icon: <FaCheckCircle />, data: stats.completed_projects },
    { key: 'profit', icon: <FaDollarSign />, data: stats.profit },
  ];

  return (
    <section className="info-section">
      <div className="info-section__tiles">
        {tileConfig.map((item) => (
          <InfoTile
            key={item.key}
            icon={item.icon}
            title={item.data.title}
            value={item.data.value}
            percentageChange={item.data.percentageChange}
          />
        ))}
      </div>
      <TasksChart />
    </section>
  );
};

export default InfoSection;