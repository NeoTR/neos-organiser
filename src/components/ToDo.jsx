import React, { useState, useEffect } from "react";
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/tasks")
      .then((res) => {
        const newTasks = [...tasks];
        for (let i = 0; i < res.data.length; i++) {
          // Check if the task is overdue and remove it from the list otherwise it would clutter
          if (res.data[i].date !== "Infinite") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dueDate = new Date(res.data[i].date);
            dueDate.setHours(0, 0, 0, 0);
            if (dueDate < today) continue;
          }
          newTasks.push({ name: res.data[i].name, date: res.data[i].date, id: res.data[i].id });
        }
        setTasks(newTasks);
        setDisplayTasks(newTasks);
      })
      .catch((err) => console.error(err));
  }, []);

  // add task to the list
  const addTask = (e) => {
    e.preventDefault();
    if (!taskName) {
      setError("Task name is required");
      return;
    }
    const taskId = uuidv4();
    const newTasks = [...tasks, { id: taskId, name: taskName, date: taskDate || "Infinite" }];
    setTasks(newTasks);
    setDisplayTasks(newTasks);
    setTaskName("");
    setTaskDate("");
    setError("");

    const data = { id: taskId, name: taskName, date: taskDate || "Infinite" };
    axios.post("http://localhost:3000/api/tasks/add", data).catch((err) => console.error(err));
  };

  // adds tasks to the homework database
  const addHomework = function () {
    const data = "input";
    axios.post("http://localhost:3000/api/HwToDB", data).then((res) => {
      alert("Homework refreshed, refresh the page to see the changes");
    });
  };

  // removes tasks from the database using the assigned id
  const removeTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    setDisplayTasks(newTasks);
    axios.delete(`http://localhost:3000/api/tasks/${id}`).catch((err) => console.error(err));
  };
  // checks if the task is overdue and changes the date to a message
  useEffect(() => {
    const today = new Date();
    setDisplayTasks(
      tasks.map((task) => {
        if (task.date !== "Infinite") {
          const dueDate = new Date(task.date);
          const diffTime = Math.abs(today - dueDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays >= 1) {
            if (dueDate < today) return { ...task, date: `This task is ${diffDays} days overdue` };
          }
        }
        return task;
      })
    );
  }, [tasks]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-md rounded">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">ToDo List</h1>
          <button className=" text-black rounded h-6 leading-none" onClick={() => addHomework()}>
            Refresh Homework
          </button>
        </div>
        <form onSubmit={addTask}>
          <input className="border p-2 rounded mb-2 w-full" type="text" placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          {error && <p className="text-red-500">{error}</p>}
          <input className="border p-2 rounded mb-2 w-full" type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} />
          <button className="bg-blue-500 text-white p-2 rounded mb-2 w-full" type="submit">
            Add Task
          </button>
        </form>
        {displayTasks
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((task, index) => (
            <div className="border p-2 rounded mb-2" key={index}>
              <h2 className="font-bold" id={task.id}>
                {task.name}
              </h2>
              <p>Due: {task.date}</p>
              <button className="bg-red-500 text-white p-2 rounded" onClick={() => removeTask(task.id)}>
                Remove
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
