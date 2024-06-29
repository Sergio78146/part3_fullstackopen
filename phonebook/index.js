const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/people');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(morgan('dev'));

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// Routes definition
// Get all persons
app.get('/api/people', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(error => next(error));
});

// Get a person by ID
app.get('/api/people/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

// Add a new person
app.post('/api/people', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number is missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
});

// Update a person
app.put('/api/people/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

// Delete a person
app.delete('/api/people/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

// Usar el middleware de manejo de errores
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
