require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('type', function(req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url : status :res[content-length] - :response-time ms :type'))


app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
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

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
       response.json(person) 
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return next({
      name: 'MissingInfo',
      message: 'Name or number missing'
    })
  }

  Person.find({'name': body.name}).then(result => {
    if(result.length() !== 0){
      return next({
        name: 'NotUnique',
        message: 'Name must be unique'
      })
    }
  })


  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.name, error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({error: 'Malformatted id'})
  } else if(error.name === 'MissingInfo'){
    return response.status(400).send({error: error.message})
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

