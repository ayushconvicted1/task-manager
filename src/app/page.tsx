"use client";

import { useState, useEffect, FormEvent } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "@/app/actions/taskActions";
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, Checkbox, IconButton, Paper } from "@mui/material";
import { Delete, CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    async function loadTasks() {
      const data: Task[] = await getTasks();
      setTasks(data);
    }
    loadTasks();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await createTask(formData);
    setTitle("");
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateTask(id, { completed: !completed });
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
  };

  const handleDelete = async (id: string) => {
    const response = await deleteTask(id);
    if (response?.success) {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Task Manager
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            label="New Task" 
            name="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </form>
      </Paper>

      <List>
        {tasks.map((task) => (
          <ListItem 
            key={task._id} 
            sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              bgcolor: task.completed ? "#e0f7fa" : "#fff", 
              borderRadius: 1, 
              mb: 1 
            }}
          >
            <Checkbox 
              icon={<RadioButtonUnchecked />} 
              checkedIcon={<CheckCircle />} 
              checked={task.completed} 
              onClick={() => toggleComplete(task._id, task.completed)} 
            />
            <ListItemText 
              primary={task.title} 
              sx={{ textDecoration: task.completed ? "line-through" : "none" }} 
            />
            <IconButton onClick={() => handleDelete(task._id)} color="error">
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
