const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('tiny'));
app.use(morgan('tiny'));

// Middleware para registrar solicitudes
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

// Ruta para obtener toda la lista de personas
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Ruta para obtener una persona según su ID
app.get("/api/persons/:id", (request, response) => {
  const idToCompare = Number(request.params.id);
  const person = persons.find((person) => person.id === idToCompare);

  if (person) {
    response.json(person);
  } else {
    response.status(404).send({ error: "Person not found" });
  }
});

// Ruta para obtener información de la página /info
app.get("/info", (request, response) => {
  const timestamp = new Date();
  const numberOfPersons = persons.length;

  response.send(`
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${timestamp}</p>
  `);
});

// Ruta para eliminar una persona por ID
app.delete("/api/persons/:id", (request, response) => {
  const idToCompare = Number(request.params.id);
  const initialLength = persons.length;
  persons = persons.filter((person) => person.id !== idToCompare);

  if (persons.length < initialLength) {
    response.status(204).end();
  } else {
    response.status(404).send({ error: "Person not found" });
  }
});

// Generar un nuevo ID
const generateId = () => {
  const maxId = persons.length > 0 
    ? Math.max(...persons.map((n) => n.id)) 
    : 0;

  const idGenerado =
    Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - maxId)) + maxId + 1;

  return idGenerado;
};

// Ruta para agregar una nueva persona
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    });
  }

  const nameExists = persons.some((person) => person.name === body.name);
  if (nameExists) {
    return response.status(409).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

// Ruta para actualizar una persona por ID
app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    });
  }

  const personToUpdate = persons.find((person) => person.id === id);
  if (!personToUpdate) {
    return response.status(404).json({
      error: 'person not found'
    });
  }

  const updatedPerson = {
    ...personToUpdate,
    name: body.name,
    number: body.number,
  };

  persons = persons.map((person) =>
    person.id === id ? updatedPerson : person
  );

  response.json(updatedPerson);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
