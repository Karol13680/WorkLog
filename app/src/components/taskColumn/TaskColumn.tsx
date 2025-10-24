import React from 'react';
import TaskCard, { type Task } from "../tiles/taskCard/TaskCard";
import './TaskColumn.scss';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, tasks }) => {
  return (
    <div className="task-column">
      <div className="task-column__header">
        <h3 className="task-column__title">{title}</h3>
        <span className="task-column__count">{tasks.length}</span>
      </div>
      <div className="task-column__tasks">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;