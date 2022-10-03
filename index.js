const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(cors());
app.use(express.static("build"));

morgan.token("person", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    "':method :url :status :res[content-length] - :response-time ms :person"
  )
);

app.use(express.json());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//get all persons
app.get("/api/persons", (req, res) => res.json(persons));

//get persons info
app.get("/info", (req, res) => {
  const info = `
  <div>Phonebook has info for ${persons.length} people</div>
  <div>${new Date()} </div>
  `;
  res.send(info);
});

//get a person of id
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) res.json(person);
  else res.status(404).end(`no this id ${id}`);
});

//delete a person of id
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(202).end(`Deleted id: ${id}`);
});

//create a new person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) return res.status(400).json({ error: "name missing" });

  if (!body.number) return res.status(400).json({ error: "number missing" });

  if (persons.find((person) => person.name === body.name))
    return res.status(400).json({ error: "name must be unique" });

  const id = Math.floor(Math.random() * 100000);
  const person = { id: id, name: body.name, number: body.number };

  persons = persons.concat(person);

  res.json(person);
});
