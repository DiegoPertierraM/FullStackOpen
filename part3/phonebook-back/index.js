const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);
  if (!person) {
    return response.status(404).json({
      error: "could not find person for the specified id",
    });
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);

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

  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  if (persons.find((p) => p.number === body.number)) {
    return response.status(400).json({
      error: "number must be unique",
    });
  }

  const newPerson = { id: generateId(), ...request.body };
  persons = persons.concat(newPerson);

  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "::", () => {
  console.log(`Server running on port ${PORT}`);
});
