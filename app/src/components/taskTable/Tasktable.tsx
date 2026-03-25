import React, { useEffect, useState, useCallback } from 'react';
import { BsPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import { apiFetch } from '../../api/apiClient';

import TaskColumn from '../taskColumn/TaskColumn';
import type { Task, Status } from '../tiles/taskCard/TaskCard';
import './TaskTable.scss';

// Mapowanie wyświetlania: Klucz frontendu -> Nazwa wyświetlana (i nazwa w bazie)
const statusMap: Record<Status, string> = {
  upcoming: 'Nadchodzące',
  'in-progress': 'Trwające',
  verification: 'Weryfikacja',
  completed: 'Zakończone'
};

// Mapowanie ID: Klucz frontendu -> ID w bazie danych (tabela status)
const statusToId: Record<Status, number> = {
  upcoming: 1,
  'in-progress': 2,
  verification: 3,
  completed: 4,
};

type ColumnsState = Record<Status, Task[]>;

const TaskTable: React.FC = () => {
  const { getToken } = useAuth();
  const [columns, setColumns] = useState<ColumnsState>({
    upcoming: [],
    'in-progress': [],
    verification: [],
    completed: []
  });
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiFetch('/jobs/all-user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const tasksByStatus: ColumnsState = {
        upcoming: [],
        'in-progress': [],
        verification: [],
        completed: []
      };

      if (Array.isArray(data)) {
        data.forEach((job: any) => {
          // Szukamy klucza (np. 'upcoming') na podstawie nazwy statusu z backendu
          const statusKey = (Object.keys(statusMap).find(
            key => statusMap[key as Status].toLowerCase() === (job.status || '').toLowerCase()
          ) as Status) || 'upcoming';

          tasksByStatus[statusKey].push({
            id: job.id,
            title: job.title || 'Brak tytułu',
            client: job.client || 'Brak klienta',
            status: statusKey,
            date: job.date || '',
            duration: job.duration?.toString() || '0',
            priority: (job.priority || 'low').toLowerCase(),
          });
        });
      }
      setColumns(tasksByStatus);
    } catch (err) {
      console.error("Błąd pobierania zadań do tablicy:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusUpdate = async (taskId: number, newStatus: Status) => {
    try {
      const token = await getToken();
      if (!token) return;

      // Przygotowujemy dane do aktualizacji (backend przyjmuje FormData)
      const formData = new FormData();
      formData.append('id_status', statusToId[newStatus].toString());

      const res = await apiFetch(`/jobs/update/${taskId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData, // apiFetch powinien obsługiwać FormData
      });

      // Jeśli aktualizacja w bazie się udała, przesuwamy kafelek lokalnie (optymalizacja UI)
      setColumns(prev => {
        const newColumns = { ...prev };
        let taskToMove: Task | undefined;

        // 1. Znajdź i usuń zadanie z obecnej kolumny
        for (const key in newColumns) {
          const sKey = key as Status;
          const index = newColumns[sKey].findIndex(t => t.id === taskId);
          if (index !== -1) {
            [taskToMove] = newColumns[sKey].splice(index, 1);
            break;
          }
        }

        // 2. Dodaj zadanie do nowej kolumny
        if (taskToMove) {
          taskToMove.status = newStatus;
          newColumns[newStatus] = [...newColumns[newStatus], taskToMove];
        }

        return { ...newColumns };
      });
    } catch (err) {
      console.error("Błąd podczas zmiany statusu:", err);
      alert("Nie udało się zmienić statusu zadania.");
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
        <div className="task-table__loading">Ładowanie tablicy...</div>
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