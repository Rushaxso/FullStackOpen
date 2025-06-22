import Country from './Country'

const Show = ({countries}) => {
  if(countries.length > 10){
    return(
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (countries.length > 1 && countries.length <= 10){
    return(
      <div>
        {countries.map(country => <div key={country.name.common}>{country.name.common}</div>)}
      </div>
    )
  } else if(countries.length === 1) {
    const country = countries[0]
    return(
      <Country country={country}/>
    )
  } else {
    return(
      <div>
        No matches
      </div>
    )
  }
}

export default Show