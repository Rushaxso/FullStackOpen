import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weathers'
import Input from './components/Input'
import Show from './components/Show'

const App = () => {
  const [input, setInput] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
  
  const hook = () => {
    countryService
      .getAll()
      .then(response => {
      const filtered = response.filter(country => country.name.common.toLowerCase().includes(input.toLowerCase()))
      setCountries(filtered)
      })
  }

  useEffect(hook, [input])

  const handleInputChange = (event) => {
    setInput(event.target.value)
    setWeather(null)
  }

  const showCountry = (country) => {
    setCountries([country])
  }

  const weatherData = (lat, lon) => {
    weatherService
      .getWeather(lat, lon)
      .then(response => setWeather(response))
  }

  return (
    <div>
      <Input input={input} onChange={handleInputChange}/>
      <Show 
        countries={countries} 
        showCountry={showCountry}
        weather={weather} 
        weatherData={weatherData}
      />
    </div>
  )
}

export default App