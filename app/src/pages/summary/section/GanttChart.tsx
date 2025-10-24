import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const tasks = [
  { name: 'Zadanie 1', start: '2025-10-19T07:00:00', end: '2025-10-19T08:20:00' },
  { name: 'Zadanie 2', start: '2025-10-19T09:00:00', end: '2025-10-19T10:20:00' },
  { name: 'Zadanie 3', start: '2025-10-19T11:00:00', end: '2025-10-19T12:20:00' },
  { name: 'Zadanie 4', start: '2025-10-19T13:00:00', end: '2025-10-19T18:21:00' },
];

const data = {
  labels: tasks.map(task => task.name),
  datasets: [{
    label: 'Czas zadania',
    data: tasks.map(task => [new Date(task.start).getTime(), new Date(task.end).getTime()]),
    backgroundColor: '#8CB0EB',
    barPercentage: 0.6,
    borderRadius: 4,
  }],
};

const options = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          const start = new Date(context.raw[0]);
          const end = new Date(context.raw[1]);
          const durationMs = end.getTime() - start.getTime();
          const hours = Math.floor(durationMs / 3600000);
          const minutes = Math.round((durationMs % 3600000) / 60000);
          return ` Czas trwania: ${hours}h ${minutes}m`;
        }
      }
    },
  },
  scales: {
    x: {
      type: 'time' as const,
      min: new Date('2025-10-19T06:00:00').getTime(),
      max: new Date('2025-10-19T24:00:00').getTime(),
      time: {
        unit: 'hour' as const,
        displayFormats: {
          hour: 'HH:00'
        }
      },
      grid: {
        color: '#adb5bd', 
      },
      ticks: {
        color: '#495057',
      }
    },
    y: {
      grid: {
        display: false,
        drawBorder: false, 
      },
      ticks: {
        color: '#212529',
        font: {
          size: 14,
        }
      }
    },
  },
};

const GanttChartDay = ({ date }: { date: string }) => (
    <div className="gantt-day">
        <h3 className="gantt-day__date">{date}</h3>
        <div className="gantt-day__chart-wrapper">
            <Bar options={options} data={data} />
        </div>
    </div>
);


const GanttChart: React.FC = () => {
  return (
    <div className="gantt-chart-container">
      <header className="gantt-chart-container__header">
        <h2 className="gantt-chart-container__title">Wykres Ganta dla mojej pracy</h2>
        <FaPrint className="gantt-chart-container__icon" />
      </header>
      <div className="gantt-chart-container__content">
        <GanttChartDay date="19-10-2025" />
        <GanttChartDay date="20-10-2025" />
        <GanttChartDay date="21-10-2025" />
      </div>
    </div>
  );
};

export default GanttChart;