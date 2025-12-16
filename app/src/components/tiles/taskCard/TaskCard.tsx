import React, { useState } from 'react';
import { FaFire, FaCheckCircle, FaHourglassHalf, FaPauseCircle, FaEllipsisV } from 'react-icons/fa';
import './TaskCard.scss';

export type Status = 'upcoming' | 'in-progress' | 'verification' | 'completed';

export interface Task {
  id: number | string;
  title: string;
  client: string;
  status: Status;
  date: string;
  duration: string;
  priority: 'low' | 'medium' | 'high';
  deleteTask?: () => void;
}

interface TaskCardProps {
  task: Task;
  onStatusChange?: (id: number | string, newStatus: Status) => void;
}

const statusConfig = {
  upcoming: { label: 'Nadchodzące', icon: <FaPauseCircle />, color: '#FFA500' },
  'in-progress': { label: 'Trwające', icon: <FaHourglassHalf />, color: '#4A86F5' },
  verification: { label: 'Weryfikacja', icon: <FaHourglassHalf />, color: '#34C759' },
  completed: { label: 'Zakończono', icon: <FaCheckCircle />, color: '#1E8449' },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const [showMenu, setShowMenu] = useState(false);

  const currentStatus = statusConfig[task.status];
  const priorityClass = `task-card__priority--${task.priority}`;

  const statusToId: Record<Status, number> = {
  'upcoming': 1,
  'in-progress': 2,
  'verification': 3,
  'completed': 4,
};

const handleStatusChange = async (newStatus: Status) => {
  setShowMenu(false);

  try {
    const formData = new FormData();
    formData.append('id_status', statusToId[newStatus].toString());

    const token = localStorage.getItem('access_token') || '';

    const response = await fetch(`http://localhost:5000/jobs/update/${task.id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Błąd aktualizacji statusu: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Status zaktualizowany:', data);
    window.location.reload();
    if (onStatusChange) onStatusChange(task.id, newStatus);
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="task-card">
      <div className="task-card__icon" style={{ color: currentStatus.color }}>
        {currentStatus.icon}
      </div>
      <div className="task-card__content">
        <h4 className="task-card__title">{task.title}</h4>
        <p className="task-card__client">{task.client}</p>
        <div className="task-card__details">
          <span>{task.status === 'completed' ? currentStatus.label : task.date}</span>
          <span>{task.duration}</span>
          <span className={`task-card__priority ${priorityClass}`}>{task.priority}</span>
        </div>
      </div>

      {/* Przycisk trzy kropki */}
      <div className="task-card__menu">
        <FaEllipsisV onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }} />
        {showMenu && (
          <div className="task-card__menu-dropdown">
            {Object.keys(statusConfig).map((statusKey) => (
              <div
                key={statusKey}
                className="task-card__menu-item"
                onClick={() => handleStatusChange(statusKey as Status)}
              >
                {statusConfig[statusKey as Status].label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
