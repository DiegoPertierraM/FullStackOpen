require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const person = require("./models/person");

const app = express();

morgan.token("req-body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);
app.use(express.static("dist"));

const generateId = () => {
  const randomNum = persons.length > 0 ? Math.trunc(Math.random() * 10000) : 0;
  return String(randomNum);
};

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    </div>
    `
  );
});

app.get("/api/persons", (request, response) => {
  Person.find().then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findById(id).then((person) => {
    response.json(person);
  });

  // if (!person) {
  //   return response.status(404).json({
  //     error: "could not find person for the specified id",
  //   });
  // }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).then((person) => {
    response.json(person);
  });

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
