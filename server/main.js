const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbPath = path.resolve("../server/db.json");
const dbPath1 = path.resolve("../server/notes.json");
const dbPath2 = path.resolve("../server/user.json");

const addHomework = require("../server/utils/som.jsx");

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:3001" }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/user/add", (req, res) => {
  const userMail = req.body.mail;
  const userPassword = req.body.password;
  const user = {
    mail: userMail,
    password: userPassword,
  };

  const jsonData = fs.readFileSync(dbPath2);
  const db = JSON.parse(jsonData);

  if (db.length === 0) {
    db.push(user);
  } else {
    db[0] = user;
  }

  fs.writeFileSync(dbPath2, JSON.stringify(db, null, 2));
  res.send("User added");
});
app.post("/api/tasks/add", (req, res) => {
  const taskName = req.body.name;
  const taskDate = req.body.date;
  const taskId = req.body.id;

  const task = {
    id: taskId,
    name: taskName,
    type: "Huiswerk",
    date: taskDate || "Infinite",
  };

  const jsonData = fs.readFileSync(dbPath);
  const db = JSON.parse(jsonData);

  db.push(task);

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.send("Task added");
});

app.post("/api/HwToDB", (req, res) => {
  addHomework();
  res.send("Homework added");
});

app.get("/api/tasks", (req, res) => {
  const jsonData = fs.readFileSync(dbPath);
  const db = JSON.parse(jsonData);

  res.send(db);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id;

  const jsonData = fs.readFileSync(dbPath);
  const db = JSON.parse(jsonData);

  const taskIndex = db.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    res.status(404).send("Task not found");
    return;
  }

  db.splice(taskIndex, 1);

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.send("Task deleted");
});

app.post("/api/notes/add", (req, res) => {
  const id = req.body.id;
  const noteName = req.body.name;
  const noteContent = req.body.content;
  const noteType = req.body.type;
  const noteDate = req.body.date;

  const note = {
    id: id,
    name: noteName,
    content: noteContent,
    type: noteType,
    date: noteDate,
  };

  const jsonData = fs.readFileSync(dbPath1);
  const db = JSON.parse(jsonData);

  db.push(note);

  fs.writeFileSync(dbPath1, JSON.stringify(db, null, 2));
  res.send("Note added");
});

app.get("/api/notes", (req, res) => {
  const jsonData = fs.readFileSync(dbPath1);
  const db = JSON.parse(jsonData);

  res.send(db);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;

  const jsonData = fs.readFileSync(dbPath1);
  const db = JSON.parse(jsonData);

  const noteIndex = db.findIndex((note) => note.id === id);
  if (noteIndex === -1) {
    res.status(404).send("Note not found");
    return;
  }

  db.splice(noteIndex, 1);

  fs.writeFileSync(dbPath1, JSON.stringify(db, null, 2));
  res.send("Note deleted");
});

app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const { name, type, content } = req.body;

  const jsonData = fs.readFileSync(dbPath1);
  const db = JSON.parse(jsonData);

  const noteIndex = db.findIndex((note) => note.id === id);
  if (noteIndex === -1) {
    res.status(404).send("Note not found");
    return;
  }

  if (name !== undefined) {
    db[noteIndex].name = name;
  }
  if (type !== undefined) {
    db[noteIndex].type = type;
  }
  if (content !== undefined) {
    db[noteIndex].content = content;
  }

  fs.writeFileSync(dbPath1, JSON.stringify(db, null, 2));
  res.send(db[noteIndex]);
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
