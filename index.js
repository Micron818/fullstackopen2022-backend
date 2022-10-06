const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("person", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

//get all persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

//get persons info
app.get("/info", (req, res) => {
  Person.countDocuments({}).then((number) => {
    const info = `
    <div>Phonebook has info for ${number} people</div>
    <div>${new Date()} </div>
    `;
    res.send(info);
  });
});

//get a person of id
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) =>
      person
        ? res.json(person)
        : res.status(400).end(`no this id: ${req.params.id}`)
    )
    .catch((reason) => next(reason));
});

//delete a person of id
app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then((person) => {
      return person
        ? res.status(202).end(`Deleted id: ${id}`)
        : res.status(204).end();
    })
    .catch((reason) => next(reason));
});

//create a new person
app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  const person = new Person({ name: body.name, number: body.number });
  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((reason) => next(reason));
});

//update person
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = { name: body.name, number: body.number };
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) =>
      updatedPerson
        ? res.json(updatedPerson)
        : res.status(400).end(`no this id: ${req.params.id}`)
    )
    .catch((error) => {
      return next(error);
    });
});

//Define errorHandler
const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  } else if (
    err.name === "MongoServerError" &&
    err.codeName === "DuplicateKey"
  ) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
