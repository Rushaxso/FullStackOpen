require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('type', function(req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url : status :res[content-length] - :response-time ms :type'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/info', (request, response) => {
  const date = new Date().toString()
  const info = 
    `<div>
      Phonebook has info for ${persons.length} people<br/>
      ${date}
    </div>`

  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name/number missing' 
    })
  }

  /*if(persons.find(person => person.name === body.name)){
    return response.status(400).json({
      error: "name must be unique"
    })
  }*/

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

