import React from 'react';
import { BsPlus } from 'react-icons/bs';
import { type Task } from "../tiles/taskCard/TaskCard";
import TaskColumn from "../taskColumn/TaskColumn";
import './TaskTable.scss';
import { Link } from 'react-router';

const mockTasks: Task[] = [
  { id: 1, title: 'Design homepage mockup', client: 'Tech.io', status: 'upcoming', date: '13.04.2025', duration: '2 h', priority: 'low' },
  { id: 2, title: 'Design homepage mockup', client: 'Tech.io', status: 'upcoming', date: '13.04.2025', duration: '2 h', priority: 'low' },
  { id: 3, title: 'Design homepage mockup', client: 'Tech.io', status: 'in-progress', date: '13.04.2025', duration: '2 h', priority: 'low' },
  { id: 4, title: 'Design homepage mockup', client: 'Tech.io', status: 'verification', date: '13.04.2025', duration: '4 h', priority: 'medium' },
  { id: 5, title: 'Design homepage mockup', client: 'Tech.io', status: 'completed', date: '13.04.2025', duration: '4 h', priority: 'high' },
  { id: 6, title: 'Design homepage mockup', client: 'Tech.io', status: 'completed', date: '13.04.2025', duration: '4 h', priority: 'high' },
  { id: 7, title: 'Design homepage mockup', client: 'Tech.io', status: 'completed', date: '13.04.2025', duration: '4 h', priority: 'high' },
];

const TaskTable: React.FC = () => {
  const upcomingTasks = mockTasks.filter(t => t.status === 'upcoming');
  const inProgressTasks = mockTasks.filter(t => t.status === 'in-progress');
  const verificationTasks = mockTasks.filter(t => t.status === 'verification');
  const completedTasks = mockTasks.filter(t => t.status === 'completed');

  return (
    <section className="task-table">
      <header className="task-table__header">
        <h2 className="task-table__title">Tablica zadań</h2>
        <Link to="/add-task" className="action-button">
          Nowy projekt <BsPlus />
        </Link>
      </header>
      <div className="task-table__board">
        <TaskColumn title="Nadchodzące" tasks={upcomingTasks} />
        <TaskColumn title="Trwające" tasks={inProgressTasks} />
        <TaskColumn title="Weryfikacja" tasks={verificationTasks} />
        <TaskColumn title="Zakończone" tasks={completedTasks} />
      </div>
    </section>
  );
};

export default TaskTable;