import { useState, useEffect } from 'react'
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

const Person = ({person, deletePerson}) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button>
    </div>
  )
}

const Persons = ({persons, filter, deletePerson}) => {
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      {personsToShow.map(person => <Person key={person.id} person={person} deletePerson={deletePerson}/>)}
    </div>
  )
}

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

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
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const oldPerson = persons.find(person => person.name === newName)
        const newPerson = {...oldPerson, number: newNumber}

        personService
          .update(newPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === newPerson.id ? returnedPerson : person))
            setNewName('')
            setNewNumber('')
            showNotification(`Updated ${newPerson.name}`, setNotification)
          })
          .catch(() => {
            showNotification(
              `Information of ${newPerson.name} has already been removed from server`,
              setError
            )
            setPersons(persons.filter(person => person.id !== newPerson.id))
          })
      }
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
          showNotification(`Added ${newName}`, setNotification)
        })
        .catch(() => {
          showNotification(
            `Could not add ${newName}`,
            setError
          )
        })
    }
  }

  const deletePerson = (person) => {
    if(window.confirm(`Delete ${person.name} ?`)){
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(filter => filter.id !== person.id))
          showNotification(`Deleted ${person.name}`, setNotification)
        })
        .catch(() => {
          `Could not delete ${person.name}`,
          setError
        })
    }
  }

  const showNotification = (message, setFucntion) => {
    setFucntion(message)
    setTimeout(() => {
      setFucntion(null)
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={notification} className={'notification'} />
        <Notification message={error} className={'error'} />
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
        <Persons persons={persons} filter={newFilter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App