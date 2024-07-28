// src/components/TaskList.tsx
import React from 'react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="mt-2">
            <select
              className="mr-2 p-1 border rounded"
              value={task.status}
              onChange={(e) => onUpdateTask({ ...task, status: e.target.value })}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => onDeleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
