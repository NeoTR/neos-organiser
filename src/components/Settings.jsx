import React, { useState } from "react";
import axios from "axios";

export default function Settings() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleMailChange = (event) => {
    setMail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      mail: mail,
      password: password,
    };

    axios
      .post("http://localhost:3000/api/user/add", data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.error("Error:", error));

    setMail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="p-4 w-1/3 bg-white rounded shadow">
        <h1 className="text-[1.5rem] font-bold pb-4">Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <label className="block">
            <span className="text-gray-700 font-bold">SomToday Mail:</span>
            <input type="email" value={mail} onChange={handleMailChange} className="border p-2 rounded mb-2 w-full" />
          </label>
          <label className="block">
            <span className="text-gray-700 font-bold">Password:</span>
            <input type="password" value={password} onChange={handlePasswordChange} className="border p-2 rounded mb-2 w-full" />
          </label>
          <input type="submit" value="Save" className="bg-blue-500 hover:bg-blue-700 text-white font-bold cursor-pointer py-2 px-6 rounded" />
        </form>
      </div>
    </div>
  );
}
