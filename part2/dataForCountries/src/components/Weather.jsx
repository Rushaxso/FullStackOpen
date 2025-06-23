const Weather = ({capital, weather}) => {
  console.log(weather)
  const weatherInfo = weather.weather[0]
  return (
    <div>
        <h2>Weather in {capital}</h2>
        <div>
          Temperature {weather.main.temp} Celsius
          <br/>
          <img 
            src={`https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`}
            alt={weatherInfo.description}
          />
          <br/>
          Wind {weather.wind.speed} m/s
        </div>
    </div>
  )
}

export default Weather