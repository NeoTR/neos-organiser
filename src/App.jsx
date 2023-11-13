import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import Todo from "./components/Todo";
import Calender from "./components/Calender";
import Notes from "./components/Notes";
import Settings from "./components/Settings";
import { ToastContainer, toast } from "react-toastify";
import "../node_modules/react-toastify/dist/ReactToastify.css";

function App() {
  useEffect(() => {
    if (!localStorage.getItem("visitedBefore")) {
      toast.warn("Fill in your settings by clicking on your profile if you want to use the refresh homework feature. If you do not do this it would not work.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      localStorage.setItem("visitedBefore", "true");
    }
  }, []);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="todo" element={<Todo />} />
          <Route path="calender" element={<Calender />} />
          <Route path="notes" element={<Notes />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<h1>Page has not been found</h1>} />
        </Route>
      </Routes>
      )}
    </Router>
  );
}

export default App;
