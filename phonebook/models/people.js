const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

  const phoneValidator = (number) => {
    const phoneRegex = /^\d{2,3}-\d+$/;
    return phoneRegex.test(number);
  };
  
  const personSchema = new mongoose.Schema({
    name: { 
      type: String,
      minlength: 3, 
      required: true 
    },
    number: { 
      type: String,
      minlength: 8, // Asegura que la longitud mínima sea de 8 caracteres
      required: true,
      validate: {
        validator: phoneValidator,
        message: props => `${props.value} no es un número de teléfono válido!`
      }
    },
  });

// Añadir método de transformación para modificar la serialización del documento
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Convertir _id a id y agregarlo al objeto retornado
    delete returnedObject._id; // Eliminar _id del objeto retornado
    delete returnedObject.__v; // Eliminar __v del objeto retornado
  }
});

const Person = mongoose.model('Person', personSchema, 'person'); // 'person' especifica el nombre de la colección

module.exports = Person;