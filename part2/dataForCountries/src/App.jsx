import { useState, useEffect } from 'react'
import countryService from './services/countries'
import Input from './components/Input'
import Show from './components/Show'

const App = () => {
  const [input, setInput] = useState('')
  const [countries, setCountries] = useState([])
  
  const hook = () => {
    countryService
      .getAll()
      .then(response => {
      const filtered = response.filter(country => country.name.common.toLowerCase().includes(input.toLowerCase()))
      setCountries(filtered)
      console.log(filtered)
      })
  }

  useEffect(hook, [input])

  const handleInputChange = (event) => {
    setInput(event.target.value)
  }

  return (
    <div>
      <Input input={input} onChange={handleInputChange}/>
      <Show countries={countries} />
    </div>
  )
}

export default App