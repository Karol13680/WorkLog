import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { useApi } from '../../../api/useApi'; // Import Twojego hooka
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
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
  rate?: string;
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
            const diff = end.getTime() - start.getTime();
            const h = Math.floor(diff / 3600000);
            const m = Math.round((diff % 3600000) / 60000);
            return `Czas: ${h}h ${m}m (${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'hour' as const,
          displayFormats: { hour: 'HH:00' },
        },
        min: new Date(`${date}T00:00:00`).getTime(),
        max: new Date(`${date}T23:59:59`).getTime(),
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="gantt-day" style={{ marginBottom: '40px', height: `${tasks.length * 50 + 100}px` }}>
      <h3 className="gantt-day__date">{new Date(date).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
      <div className="gantt-day__chart-wrapper" style={{ height: '100%' }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

const GanttChart: React.FC = () => {
  const { api } = useApi(); // Inicjalizacja automatu
  const [tasksByDate, setTasksByDate] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGanttData = async () => {
      setLoading(true);
      try {
        // Automat api sam zadba o token i uderzy pod właściwy adres
        const response = await api('/stats/gantt');

        const tasks: Task[] = response.tasks || [];
        const grouped: Record<string, Task[]> = {};

        tasks.forEach(task => {
          const dateKey = task.start.split('T')[0];
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(task);
        });

        const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
        const sortedGrouped: Record<string, Task[]> = {};
        sortedKeys.forEach(key => sortedGrouped[key] = grouped[key]);

        setTasksByDate(sortedGrouped);
      } catch (err) {
        console.error("Błąd Gantta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGanttData();
  }, []); // Usunięto getToken z zależności

  const generatePDF = async () => {
    if (!chartRef.current) return;

    try {
      // Pobieranie raportu przez automat api
      const reportData = await api('/stats/detailed-report');

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.setFontSize(22);
      pdf.setTextColor(44, 62, 80);
      pdf.text('RAPORT PRACY I ZAROBKOW', 14, 20); 
      
      pdf.setFontSize(10);
      pdf.setTextColor(127, 140, 141);
      pdf.text(`Wygenerowano: ${new Date().toLocaleDateString('pl-PL')} ${new Date().toLocaleTimeString('pl-PL')}`, 14, 28);

      const tableRows = reportData.projects.map((p: any) => [
        p.project_name,
        p.client_name,
        p.formatted_time,
        p.rate.replace('ł', 'l'), 
        p.profit_str.replace('ł', 'l') 
      ]);

      autoTable(pdf, {
        startY: 35,
        head: [['Projekt', 'Klient', 'Czas', 'Stawka (zl/h)', 'Zysk (zl)']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [74, 134, 245], fontSize: 10, halign: 'center' },
        styles: { fontSize: 9, valign: 'middle' },
        columnStyles: {
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' }
        }
      });

      const finalY = (pdf as any).lastAutoTable.finalY + 12;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      
      pdf.text(`SUMA CZASU: ${reportData.summary.total_time}`, 14, finalY);
      pdf.text(`SUMA ZYSKU: ${reportData.summary.total_profit.replace('ł', 'l')}`, 14, finalY + 8);

      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text('Wizualizacja czasu pracy (Gantt)', 14, 15);
      
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth() - 28;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 14, 25, pdfWidth, pdfHeight);

      pdf.save(`Raport_Pracy_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (err) {
      console.error("Błąd PDF:", err);
      alert("Wystąpił błąd podczas generowania raportu.");
    }
  };

  return (
    <div className="gantt-chart-container" style={{ padding: '20px' }}>
      <header className="gantt-chart-container__header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 className="gantt-chart-container__title">Wykres czasu pracy</h2>
        <FaPrint 
          className="gantt-chart-container__icon" 
          style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#4A86F5' }} 
          onClick={generatePDF} 
        />
      </header>
      
      <div className="gantt-chart-container__content" ref={chartRef}>
        {loading ? <p>Ładowanie wykresu...</p> : 
         Object.keys(tasksByDate).length === 0 ? <p>Brak danych do wyświetlenia.</p> :
         Object.entries(tasksByDate).map(([date, tasks]) => (
          <GanttChartDay key={date} date={date} tasks={tasks} />
        ))}
      </div>
    </div>
  );
};

export default GanttChart;