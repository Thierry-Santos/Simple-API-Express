const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let requests = 0;

server.use((req, res, next) => {
  next();
});

function checkIdExist(req, res, next) {
  const { id } = req.params;

  if (!projects[id]) {
    return res.status(400).json({ error: "O projeto requerido não existe!" });
  }

  return next();
}

function requestsCount(req, res, next) {
  requests++;

  console.log(`requests feitas até o momento: ${requests}`);

  return next();
}

server.post("/projects", requestsCount, (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

server.get("/projects", requestsCount, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdExist, requestsCount, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let data = {
    id: projects[id].id,
    title: title,
    tasks: projects[id].tasks
  };

  projects[id] = data;

  return res.json(projects);
});

server.delete("/projects/:id", checkIdExist, requestsCount, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkIdExist, requestsCount, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  projects[id].tasks.push(task);

  return res.json(projects);
});

server.listen(3000);
