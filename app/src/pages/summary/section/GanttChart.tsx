import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { FaPrint } from 'react-icons/fa';
import './GanttChart.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale);

interface Task {
  name: string;
  start: string;
  end: string;
}

interface GanttChartDayProps {
  date: string;
  tasks: Task[];
}

const GanttChartDay: React.FC<GanttChartDayProps> = ({ date, tasks }) => {
  const data = {
    labels: tasks.map(task => task.name),
    datasets: [
      {
        label: 'Czas zadania',
        data: tasks.map(task => [new Date(task.start).getTime(), new Date(task.end).getTime()]),
        backgroundColor: '#8CB0EB',
        barPercentage: 0.6,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const start = new Date(context.raw[0]);
            const end = new Date(context.raw[1]);
            const durationMs = end.getTime() - start.getTime();
            const hours = Math.floor(durationMs / 3600000);
            const minutes = Math.round((durationMs % 3600000) / 60000);
            return `Czas trwania: ${hours}h ${minutes}m`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        min: new Date(`${date}T06:00:00`).getTime(),
        max: new Date(`${date}T24:00:00`).getTime(),
        time: {
          unit: 'hour' as const,
          displayFormats: { hour: 'HH:00' },
        },
        grid: { color: '#adb5bd' },
        ticks: { color: '#495057' },
      },
      y: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#212529', font: { size: 14 } },
      },
    },
  };

  return (
    <div className="gantt-day">
      <h3 className="gantt-day__date">{date}</h3>
      <div className="gantt-day__chart-wrapper">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

const GanttChart: React.FC = () => {
  const [tasksByDate, setTasksByDate] = useState<Record<string, Task[]>>({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/stats/gantt', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Nie udało się pobrać danych.');

        const data = await response.json();
        const tasks: Task[] = data.tasks || [];

        const grouped: Record<string, Task[]> = {};
        tasks.forEach(task => {
          const dateKey = task.start.split('T')[0];
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(task);
        });

        setTasksByDate(grouped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="gantt-chart-container">
      <header className="gantt-chart-container__header">
        <h2 className="gantt-chart-container__title">Wykres Ganta dla mojej pracy</h2>
        <FaPrint className="gantt-chart-container__icon" />
      </header>
      <div className="gantt-chart-container__content">
        {Object.keys(tasksByDate).length === 0 && <p>Brak danych do wyświetlenia.</p>}
        {Object.entries(tasksByDate).map(([date, tasks]) => (
          <GanttChartDay key={date} date={date} tasks={tasks} />
        ))}
      </div>
    </div>
  );
};

export default GanttChart;
