const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.yl9idok.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person =>
      console.log(`${person.name} ${person.number}`)
    )
    mongoose.connection.close()
  })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}