import React, { useState, useEffect } from "react";
import axios from "axios";
import { generateDate } from "../lib/consts/calender";
import cn from "classnames";
import dayjs from "dayjs";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export default function Calendar() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);
  const [tasks, setTasks] = useState([]);

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
  }, []);

  const tasksForSelectedDate = tasks.filter((task) => {
    return dayjs(task.date).format("YYYY-MM-DD") === dayjs(selectDate).format("YYYY-MM-DD") || dayjs(task.date) === "Infinite";
  });

  return (
    <div className="flex flex-col sm:flex-row gap-10 sm:divide-x justify-center w-full sm:w-1/2 mx-auto h-screen items-center">
      <div className="w-full sm:w-96 h-96">
        <div className="flex justify-between items-center">
          <h1 className="select-none font-semibold">
            {today.format("MMMM")} {today.format("YYYY")}
          </h1>
          <div className="flex items-center gap-3">
            <GrFormPrevious className="w-5 h-5 cursor-pointer" onClick={() => setToday(today.subtract(1, "month"))} />
            <h1>Today</h1>
            <GrFormNext className="w-5 h-5 cursor-pointer" onClick={() => setToday(today.add(1, "month"))} />
          </div>
        </div>
        <div className="w-full grid grid-cols-7 text-gray-500">
          {days.map((day, index) => (
            <h1 key={index} className="h-14 font-bold grid place-content-center">
              {day}
            </h1>
          ))}
        </div>
        <div className="w-full grid grid-cols-7">
          {generateDate(today.month(), today.year()).map(({ date, currentMonth, today }, index) => {
            return (
              <div key={index} className="h-14 border-t grid place-content-center text-sm">
                <h1
                  onClick={() => {
                    setSelectDate(date);
                  }}
                  className={cn(currentMonth ? "" : "text-gray-400", today ? "bg-red-600 text-white" : "", selectDate.toDate().toDateString() === date.toDate().toDateString() ? "bg-black text-white" : "", "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none")}
                >
                  {date.date()}
                </h1>
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-96 w-full sm:w-96 sm:px-5">
        <h1 className="font-semibold">Schedule for {selectDate.toDate().toDateString()}</h1>
        {tasksForSelectedDate.length > 0 ? (
          tasksForSelectedDate.map((task, index) => (
            <div key={index}>
              <h2>{task.name}</h2>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No tasks for today.</p>
        )}
      </div>
    </div>
  );
}
