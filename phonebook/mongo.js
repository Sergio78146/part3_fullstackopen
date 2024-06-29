const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://sergiomapa046:${password}@clusterperson.ld3ek5b.mongodb.net/person?retryWrites=true&w=majority&appName=ClusterPerson`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
  });
  
  const Person = mongoose.model('Person', personSchema, 'person');

  const person = new Person({
    name: 'Balotellis',
    number: 99,
  })
  
  /*
  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
  */
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
})