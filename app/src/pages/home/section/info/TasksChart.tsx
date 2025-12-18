import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('Brak tokenu autoryzacji');

        const response = await fetch('/jobs/all-user', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Nie udało się pobrać projektów');

        const data: Project[] = await response.json();

        // ✅ Filtruj tylko zakończone projekty
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
  }, []);

  // ✅ Grupowanie zakończonych projektów po tytule (jak w oryginale)
  const projectStats = projects.reduce<Record<string, number>>((acc, project) => {
    const key = project.title || 'Inne';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: [''], // pojedynczy pasek złożony z wielu kolorowych segmentów
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
    indexAxis: 'y' as const, // ✅ poziomy wykres
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

  if (loading) return <p>Ładowanie wykresu...</p>;
  if (projects.length === 0) return <p>Brak zakończonych projektów do wyświetlenia.</p>;

  return (
    <div className="tasks-chart">
      <BsThreeDotsVertical className="tasks-chart__menu-icon" />
      <div className="tasks-chart__chart-wrapper">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default TasksChart;
