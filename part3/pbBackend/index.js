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

app.get('/info', (request, response, next) => {
  const date = new Date().toString()
  Person.find({})
    .then(result => {
      const amount = result.length
      const info = 
        `<div>
          Phonebook has info for ${amount} people<br/>
          ${date}
        </div>`
      response.send(info)  
    })
    .catch(error => next(error))

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
    if(result.length !== 0){
      return next({
        name: 'NotUnique',
        message: 'Name must be unique'
      })
    } else {
      const person = new Person({
        name: body.name,
        number: body.number
      })

      person.save()
        .then(savedPerson => {
          response.json(savedPerson)
        })
        .catch(error => next(error))
    }
  })
})

app.put('/api/persons/:id', (request, response, next) => {

  const {name, number} = request.body

  Person.findById(request.params.id)
    .then(person => {
      if(!person){
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      person.save()
        .then(updatedPerson => {
          response.json(updatedPerson)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  const name = error.name
  console.error(name, error.message)
  if(name === 'CastError'){
    return response.status(400).send({error: 'Malformatted id'})
  } else if((name === 'MissingInfo') || (name === 'NotUnique') || (name === 'ValidationError')){
    return response.status(400).send({error: error.message})
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

