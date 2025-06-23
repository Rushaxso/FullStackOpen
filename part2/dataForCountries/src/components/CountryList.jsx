const CountryList = ({country, showCountry}) => {
  return (
    <div>
      {country.name.common} <button onClick={() => showCountry(country)}>show</button>
    </div>
  )
}

export default CountryList