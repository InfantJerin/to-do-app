// src/App.tsx
import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const fetchedTasks = await fetchTasks();
    setTasks(fetchedTasks);
  };

  const handleCreateTask = async (newTask: Omit<Task, 'id'>) => {
    const createdTask = await createTask(newTask);
    setTasks([...tasks, createdTask]);
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    await updateTask(updatedTask);
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(task => task.status === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Task Manager</h1>
      <TaskForm onCreateTask={handleCreateTask} />
      <div className="mt-8">
        <select
          className="mb-4 p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <TaskList
          tasks={filteredTasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
};

export default App;





