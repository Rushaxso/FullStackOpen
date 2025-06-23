import Weather from './Weather'

const Country = ({country, weather}) => {
  const languages = Object.entries(country.languages)
  const flagStyle = {
    border: '1px solid black'
  }
  
  return(
    <div>
      <h1>{country.name.common}</h1>
      <div>
        Capital: {country.capital}<br/>
        Area: {country.area}
      </div>
      <h2>Languages</h2>
      <ul>
        {languages.map(([k, v]) => <li key={k}>{v}</li>)}
      </ul>
      <img 
        src={country.flags.png} 
        alt={country.name.common} 
        width={200} height={"auto"}
        style={flagStyle}
      />
      <Weather capital={country.capital} weather={weather}/>
    </div>
  )
}

export default Country