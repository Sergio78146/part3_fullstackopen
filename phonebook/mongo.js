require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// Si se proporciona el password como variable de entorno, añadir nueva persona
if (password && process.argv.length === 2) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });

  person.save()
    .then(result => {
      console.log(`Added ${name} with number ${number} to phonebook`);
    })
    .catch(error => {
      console.error('Error saving person:', error.message);
    })
    .finally(() => {
      mongoose.connection.close();
    });
}
// Mostrar todas las personas
else if (process.argv.length === 2) {
  Person.find({})
    .then(result => {
      console.log('Phonebook:');
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
    })
    .catch(error => {
      console.error('Error fetching persons:', error.message);
    })
    .finally(() => {
      mongoose.connection.close();
    });
}
// Mensaje de error si no se proporciona la cantidad correcta de argumentos
else {
  console.log('Please provide the password as an argument');
  process.exit(1);
}

module.exports = Person;
