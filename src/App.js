
import React, { useState } from 'react';

// import css file for styling
import './App.css';

// Mapping of weather conditions to emojis
const conditionMap = {
  Clear: "Sunny ☀️",
  Clouds: "Cloudy ☁️",
  Rain: "Rainy 🌧️",
  Drizzle: "Drizzly 🌦️",
  Thunderstorm: "ThunderStorm ⛈️",
  Snow: "Snowy ❄️",
  Mist: "Misty 🌫️",
};

const formatDate = (date) => 
  new Date(date).toLocaleString(undefined, {
    weekday: "long", //monday
    year: "numeric", //2026
    month: "long", //April
    day: "numeric", //4
    hour: "2-digit", // 10 am
    minute: "2-digit", //30
  });

  // Main react componet
function App() {

  //takes input from user
  const [city, setCity] = useState("");


  // store api weather data
  const [weather, setWeather] = useState(null);

  const [error, setError] = useState("");


// api call is in progress
  const [loading, setLoading] = useState(false);

const apiKey = process.env.REACT_APP_API_KEY;
  

  // funciton to decide background based on weather condition

  const getBackground = () => {
    if (!weather ) return "default";


    const condition = (weather.weather?.[0]?.main || "").toLowerCase();

    //match conditon to background class

    if (condition.includes("cloud"))
      return "cloudy";
    if (condition.includes("rain"))
    return "rainy";
  if (condition.includes("clear"))
    return "sunny";
  if (condition.includes("snow"))
return "snowy";

  return "default";

};
 const fetchWeather = async () => {

  setError("")
  setWeather(null);

  if (!apiKey) {
    setError("API Key is not found. Please set Your React_app_API_KEY.");
    return;
  }

  //chekc if user has entered a city name or not
  if (!city.trim()) {
    setError("Please enter a city name.");
    return;
  }

  try {
    setLoading(true);
     const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&appid=${apiKey}&units=metric`
     );

     if (!response.ok) {
      const data = await
      response.json().catch(() => ({}));
      const message = data.message ?
      data.message : "City not found.";
      setError(message);
      return;
     }
     // conver respons to json
     const data = await response.json();
     if (data.cod && data.cod !== 200) {
      setError(data.message || "city not found.");
      return;
     }

     //save weatehr data to state
     setWeather(data);


  } catch (err) {
    console.error(err);
    setError("unalbe to fetch weather data. Try again later.");
  }
  finally {
    //stop loading in all cases
    setLoading(false);
  }

 };

 //fucntion to trigger search when enter key is pressed or search button is clicked

 const onInputKeyDown = (event) => {
  if (event.key === "Enter")
    fetchWeather();
 };

 const clearSearch = () => {
  setCity("");
  setError("");
  setWeather(null);
 };



 return (
  <main className={`app ${getBackground()}` }>
    <section className="panel">

    <h1>Weather Finder</h1>

    <p>Search any city and get current weather information</p>

    <div className="search-box">
      <input
      type="text"
      placeholder="Enter city name (eg. Pune)"
      value={city}

      onChange={(e) => setCity(e.target.value)} 
      onKeyDown={onInputKeyDown} 
      aria-label="City name" />

      
      <button onClick={fetchWeather}
      disabled={loading}>
        {loading ? "Searching...." : "Search"}
      </button>

      
      <button onClick={clearSearch}
      className="outline">
         Clear
      </button>
    </div>

    
    {error && <p className="message error">{error}</p>}

  
  {weather && (
    <article className="card">
      <div className="top-row">
        <div>
          <h2>
            {weather.name}
            {weather.sys?.country ? `, ${weather.sys.country}` : ""}
          </h2>
          <p className="date">{formatDate(weather.dt * 1000)}</p>
        </div>
        <span  className="condition-tag">
          {conditionMap[weather.weather?.[0]?.main] || "Weather"}
        </span>
        
      </div>
      <div className="temperature">
        {Math.round(weather.main.temp)}
        <small>°C</small>
      </div>
      <p className="desc">
        {weather.weather?.[0]?.description}
      </p>
      

     

      <div className="details">
        <div>
          <strong>Humidity</strong>
          <p>{weather.main.humidity}%</p>
        </div>
        <div>
          <strong>Wind</strong>
          <p>{Math.round(weather.wind.speed)} m/s</p>
        </div>
        <div>
          <strong>Feels Like</strong>
          <p>{Math.round(weather.main.feels_like)}°C </p>
        </div>
        <div>
          <strong>Pressure</strong>
          <p>{weather.main.pressure}hPa</p>
        </div>

      </div>
    </article>
  )}
  </section>
  </main>
 );
}
export default App;
