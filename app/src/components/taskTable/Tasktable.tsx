import React, { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import TaskColumn from '../taskColumn/TaskColumn';
import type { Task, Status } from '../tiles/taskCard/TaskCard';
import './TaskTable.scss';

const statusMap: Record<Status, string> = {
  upcoming: 'Nadchodzące',
  'in-progress': 'Trwające',
  verification: 'Weryfikacja',
  completed: 'Zakończone'
};

const statusToId: Record<Status, number> = {
  upcoming: 1,
  'in-progress': 2,
  verification: 3,
  completed: 4,
};

type ColumnsState = Record<Status, Task[]>;

const TaskTable: React.FC = () => {
  const [columns, setColumns] = useState<ColumnsState>({
    upcoming: [],
    'in-progress': [],
    verification: [],
    completed: []
  });
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      const res = await fetch('/jobs/all-user', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (res.ok) {
        const tasksByStatus: ColumnsState = {
          upcoming: [],
          'in-progress': [],
          verification: [],
          completed: []
        };

        data.forEach((job: any) => {
          const statusKey = (Object.keys(statusMap).find(
            key => statusMap[key as Status] === job.status
          ) as Status) || 'upcoming';

          tasksByStatus[statusKey].push({
            id: job.id,
            title: job.title || 'Brak tytułu',
            client: job.client || 'Brak klienta',
            status: statusKey,
            date: job.date || '',
            duration: job.duration?.toString() || '',
            priority: job.priority || 'low',
          });
        });
        setColumns(tasksByStatus);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (taskId: number, newStatus: Status) => {
    const token = localStorage.getItem('access_token') || '';
    const formData = new FormData();
    formData.append('id_status', statusToId[newStatus].toString());

    try {
      const res = await fetch(`/jobs/update/${taskId}`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        setColumns(prev => {
          let movedTask: Task | undefined;
          const newColumns = { ...prev };
          
          for (const key in newColumns) {
            const statusKey = key as Status;
            const taskIndex = newColumns[statusKey].findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              [movedTask] = newColumns[statusKey].splice(taskIndex, 1);
              break;
            }
          }

          if (movedTask) {
            movedTask.status = newStatus;
            newColumns[newStatus] = [...newColumns[newStatus], movedTask];
          }

          return { ...newColumns };
        });
      }
    } catch (err) {
      console.error(err);
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
          {(Object.keys(statusMap) as Status[]).map((key) => (
            <TaskColumn
              key={key}
              title={statusMap[key]}
              tasks={columns[key]}
              onStatusChange={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskTable;