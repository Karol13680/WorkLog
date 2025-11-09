import React, { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import TaskColumn from '../taskColumn/TaskColumn';
import type { Task } from '../tiles/taskCard/TaskCard';
import './TaskTable.scss';

const statusMap: Record<string, string> = {
  upcoming: 'Nadchodzące',
  'in-progress': 'Trwające',
  verification: 'Weryfikacja',
  completed: 'Zakończone'
};

interface TaskWithDelete extends Task {
  deleteTask?: () => void;
}

type ColumnsState = Record<string, TaskWithDelete[]>;

const TaskTable: React.FC = () => {
  const [columns, setColumns] = useState<ColumnsState>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token') || '';
        const res = await fetch('http://localhost:5000/jobs/all-user', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();

        if (res.ok) {
          const tasksByStatus: ColumnsState = Object.keys(statusMap).reduce(
            (acc, key) => {
              acc[key] = [];
              return acc;
            },
            {} as ColumnsState
          );

          data.forEach((job: any) => {
            const statusKey =
              (Object.keys(statusMap).find(
                key => statusMap[key] === job.status
              ) as Task['status']) || 'upcoming';

            const task: TaskWithDelete = {
              id: job.id,
              title: job.title || 'Brak tytułu',
              client: job.client || 'Brak klienta',
              status: statusKey,
              date: job.date || '',
              duration: job.duration?.toString() || '',
              priority: job.priority || 'low',
              deleteTask: () => handleDelete(job.id, statusKey),
            };

            if (tasksByStatus[statusKey]) {
              tasksByStatus[statusKey].push(task);
            }
          });
          setColumns(tasksByStatus);
        } else {
          console.error('Błąd pobierania projektów', data.message);
        }
      } catch (err) {
        console.error('Błąd sieci', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId: number, statusKey: string) => {
    const originalColumns = { ...columns };
    setColumns(prev => ({
      ...prev,
      [statusKey]: prev[statusKey].filter(t => t.id !== taskId),
    }));

    try {
      const token = localStorage.getItem('access_token') || '';
      const res = await fetch(`http://localhost:5000/jobs/delete/${taskId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Błąd usuwania zadania:', data.message);
        setColumns(originalColumns);
      }
    } catch (err) {
      console.error('Błąd sieci przy usuwaniu zadania', err);
      setColumns(originalColumns);
    }
  };

  return (
    <section className="task-table">
      <header className="task-table__header">
        <h2 className="task-table__title">Tablica zadań</h2>
        <Link to="/add-task" className="action-button">
          Nowy projekt <BsPlus />
        </Link>
      </header>

      {loading ? (
        <p>Ładowanie projektów...</p>
      ) : (
        <div className="task-table__board">
          {Object.entries(statusMap).map(([key, title]) => (
            <TaskColumn
              key={key}
              title={title}
              tasks={columns[key] || []}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskTable;