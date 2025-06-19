import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({filter, onChange}) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={onChange}/>
    </div>
  )
}

const Form = ({name, number, onSubmit, nameChange, numberChange}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input onChange={nameChange} value={name}/>
      </div>
      <div>
        number: <input value={number} onChange={numberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({person}) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={}>delete</button>
    </div>
  )
}

const Persons = ({persons, filter}) => {
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      {personsToShow.map(person => <Person key={person.id} person={person}/>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  useEffect(hook, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if(persons.map(person => person.name).includes(newName)){
      alert(`${newName} is already added to phonebook`)
    } else if( (newName === '') || (newNumber === '') ){
      alert(`Please add a name/number to the person`)
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter filter={newFilter} onChange={handleFilterChange}/>
      <h2>add a new</h2>
        <Form 
          name={newName} 
          number={newNumber} 
          onSubmit={addPerson} 
          nameChange={handleNameChange} 
          numberChange={handleNumberChange}
        />
      <h2>Numbers</h2>
        <Persons persons={persons} filter={newFilter}/>
    </div>
  )
}

export default App