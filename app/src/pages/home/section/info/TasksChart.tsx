import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useAuth } from "@clerk/clerk-react";
import { apiFetch } from '../../../../api/apiClient'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BsThreeDotsVertical } from 'react-icons/bs';
import './TasksChart.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Project {
  id: number;
  title: string;
  status: string;
  client: string;
  description: string;
}

const TasksChart: React.FC = () => {
  const { getToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) return;

        // Używamy apiFetch zamiast surowego fetch
        const data: Project[] = await apiFetch('/jobs/all-user', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filtrujemy projekty o statusie "Zakończone"
        const completed = data.filter(
          (p) => p.status && p.status.toLowerCase().includes('zakończ')
        );

        setProjects(completed);
      } catch (err) {
        console.error('[Błąd pobierania projektów]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [getToken]);

  const projectStats = projects.reduce<Record<string, number>>((acc, project) => {
    const key = project.title || 'Inne';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: [''], 
    datasets: Object.entries(projectStats).map(([key, value], index) => {
      const colors = ['#F37F7E', '#8CB0EB', '#4A86F5', '#FAD15A', '#A1D490', '#9D84F1', '#6EC1E4'];
      return {
        label: key,
        data: [value],
        backgroundColor: colors[index % colors.length],
        borderWidth: 0,
      };
    }),
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Tablica wykonanych projektów',
        align: 'start' as const,
        padding: { bottom: 25 },
        font: { size: 18, weight: 600 },
        color: '#212529',
      },
      legend: {
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 20,
          font: { size: 12 },
          color: '#6c757d',
        },
      },
    },
    scales: {
      x: { stacked: true, display: false, grid: { display: false } },
      y: { stacked: true, display: false, grid: { display: false } },
    },
  };

  if (loading) return <div className="tasks-chart__loading">Ładowanie wykresu...</div>;
  
  return (
    <div className="tasks-chart">
      <BsThreeDotsVertical className="tasks-chart__menu-icon" />
      <div className="tasks-chart__chart-wrapper">
        {projects.length > 0 ? (
          <Bar options={options} data={data} />
        ) : (
          <p className="no-data">Brak zakończonych projektów.</p>
        )}
      </div>
    </div>
  );
};

export default TasksChart;