"use server";

import { connectToDB } from "@/utils/mongodb";
import Task from "@/models/Task";

interface TaskType {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
}

export const getTasks = async (): Promise<TaskType[]> => {
  await connectToDB();
  const tasks = await Task.find().sort({ dueDate: 1 });

  return tasks.map((task) => ({
    _id: task._id.toString(),
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
    completed: task.completed,
  }));
};

export const createTask = async (formData: FormData): Promise<TaskType> => {
  await connectToDB();

  const title = formData.get("title") as string;
  const newTask = new Task({ title, completed: false });

  await newTask.save();

  return {
    _id: newTask._id.toString(),
    title: newTask.title,
    description: newTask.description || "",
    dueDate: newTask.dueDate ? newTask.dueDate.toISOString() : undefined,
    completed: newTask.completed,
  };
};

export const updateTask = async (id: string, updates: Partial<TaskType>): Promise<TaskType | null> => {
  await connectToDB();
  const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

  if (!updatedTask) return null;

  return {
    _id: updatedTask._id.toString(),
    title: updatedTask.title,
    description: updatedTask.description || "",
    dueDate: updatedTask.dueDate ? updatedTask.dueDate.toISOString() : undefined,
    completed: updatedTask.completed,
  };
};

export const deleteTask = async (id: string): Promise<{ success: boolean }> => {
  await connectToDB();
  await Task.findByIdAndDelete(id);
  return { success: true };
};
