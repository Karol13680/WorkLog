import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TasksChart: React.FC = () => {
  const options = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Tablica wykonanych zadań',
      align: 'start' as const,
      padding: {
        bottom: 25,
      },
      font: {
        size: 18,
        weight: 600, // Zmiana tutaj
      },
      color: '#212529',
    },
    legend: {
      position: 'bottom' as const,
      align: 'start' as const,
      labels: {
        boxWidth: 10,
        boxHeight: 10,
        padding: 20,
        font: {
          size: 12,
        },
        color: '#6c757d',
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      display: false,
      grid: {
        display: false,
      },
    },
  },
};

  const data = {
    labels: [''],
    datasets: [
      {
        label: 'Grafika',
        data: [25],
        backgroundColor: '#F37F7E',
      },
      {
        label: 'Strony internetowe',
        data: [20],
        backgroundColor: '#8CB0EB',
      },
      {
        label: 'Aplikacje mobilne',
        data: [35],
        backgroundColor: '#4A86F5',
      },
      {
        label: 'Inne',
        data: [20],
        backgroundColor: '#FAD15A',
      },
    ],
  };

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