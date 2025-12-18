import React from 'react';
import TaskCard from '../tiles/taskCard/TaskCard';
import type { Task } from '../tiles/taskCard/TaskCard';
import './taskColumn.scss';

interface Props {
  title: string;
  tasks: Task[];
}

const TaskColumn: React.FC<Props> = ({ title, tasks = [] }) => {
  return (
    <div className="task-column">
      <div className="task-column__header">
        <h3 className="task-column__title">{title}</h3>
        <span className="task-column__count">{tasks.length}</span>
      </div>

      <div className="task-column__tasks">
        {tasks.map((task) => (
          <div key={task.id} className="task-card__wrapper">
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;