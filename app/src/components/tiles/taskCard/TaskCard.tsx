import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaFire, FaCheckCircle, FaHourglassHalf, FaPauseCircle } from 'react-icons/fa';
import './TaskCard.scss';

export interface Task {
  id: number;
  title: string;
  client: string;
  status: 'upcoming' | 'in-progress' | 'verification' | 'completed';
  date: string;
  duration: string;
  priority: 'low' | 'medium' | 'high';
}

interface TaskCardProps {
  task: Task;
}

const statusConfig = {
  upcoming: {
    label: 'Nadchodzące',
    icon: <FaPauseCircle />,
    color: '#FFA500',
  },
  'in-progress': {
    label: 'Trwające',
    icon: <FaHourglassHalf />,
    color: '#4A86F5',
  },
  verification: {
    label: 'Weryfikacja',
    icon: <FaHourglassHalf />,
    color: '#34C759',
  },
  completed: {
    label: 'Zakończono',
    icon: <FaCheckCircle />,
    color: '#1E8449',
  },
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const currentStatus = statusConfig[task.status];
  const priorityClass = `task-card__priority--${task.priority}`;

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
      <BsThreeDotsVertical className="task-card__menu" />
    </div>
  );
};

export default TaskCard;