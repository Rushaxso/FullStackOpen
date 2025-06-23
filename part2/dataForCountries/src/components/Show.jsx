import CountryList from './CountryList'
import Country from './Country'

const Show = ({countries, showCountry, weather, weatherData}) => {
  if(countries.length > 10){
    return(
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (countries.length > 1 && countries.length <= 10){
    return(
      <div>
        {countries.map(country => 
          <CountryList 
            key={country.name.common} 
            country={country} 
            showCountry={showCountry}
          />)}
      </div>
    )
  } else if(countries.length === 1) {
    const country = countries[0]
    if(!weather){
      const [lat, lon] = country.capitalInfo.latlng
      weatherData(lat, lon) 
    } else {
      return(
        <div>
          <Country country={country} weather={weather}/>      
        </div>
      )
    }
  } else {
    return(
      <div>
        No matches
      </div>
    )
  }
}

export default Show