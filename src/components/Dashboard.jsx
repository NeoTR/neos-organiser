import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasksForToday = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/tasks")
      .then((res) => {
        const formattedTasks = res.data.map((task) => ({
          ...task,
          date: dayjs(task.date).toDate().toDateString(),
        }));
        setTasks(formattedTasks);
      })
      .catch((err) => console.error(err));
  });

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to the dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow-md rounded">
          <h2 className="font-bold text-xl mb-2">Instructions</h2>
          <p className="text-gray-600">
            This is a work in progress organiser mostly for school. You can add homework, notes, and tasks. You can also add your SomToday account to automatically add your homework to the calender and to-do list! <p className="font-bold">To make the refresh button in To-Do List work you need to add your SomToday details in settings.</p>
          </p>
        </div>
        <div className="p-4 bg-white shadow-md rounded">
          <h2 className="font-bold text-xl mb-2">Notifications</h2>
          <p className="text-gray-600">Coming Soon, This would display your due projects and tasks. Also it would add the SomToday notifications when enabled.</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded">
          <h2 className="font-bold text-xl mb-2">Tasks for today:</h2>
          <div className="flex flex-col gap-2">
            {tasksForToday.map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </div>
          <p className="text-gray-600"></p>
        </div>
      </div>
    </div>
  );
}

function Task({ task }) {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
      <span className="text-gray-600">{task.name}</span>
    </div>
  );
}
