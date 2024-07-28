
// src/api.ts
import axios from 'axios';
import { Task } from './types';

const API_URL = 'http://localhost:8000';

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/tasks/`);
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await axios.post(`${API_URL}/tasks/`, task);
  return response.data;
};

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await axios.put(`${API_URL}/tasks/${task.id}`, task);
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await axios.delete(`${API_URL}/tasks/${taskId}`);
};

