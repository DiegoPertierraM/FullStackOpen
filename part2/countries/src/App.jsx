import "./index.css";
import { useState, useEffect } from "react";
import countriesService from "./services/countries";
import weatherService from "./services/weather";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState([]);
  const [weather, setWeather] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    countriesService.getAll().then((response) => {
      setCountries(response.data);
    });
  }, []);

  useEffect(() => {
    if (search.length === 1) {
      setSelectedCountry(search[0]);
    }
  }, [search]);

  useEffect(() => {
    if (selectedCountry) {
      weatherService
        .getWeather(selectedCountry.capital)
        .then((response) => setWeather(response.data))
        .catch((error) => console.log(error));
    }
  }, [selectedCountry]);

  const handleCountries = (event) => {
    event.preventDefault();
    setSearch(
      countries.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      )
    );
  };

  const showCountry = (name) => {
    const handler = () => {
      setSearch(search.filter((country) => country.name.common === name));
    };
    return handler;
  };

  const searchReturn = (countries) => {
    if (countries.length <= 0 || countries.length === 250) {
      return <></>;
    }

    if (countries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    }

    if (countries.length === 1) {
      const country = countries[0];
      return (
        <ul>
          <li>
            <h2>{country.name.common}</h2>
          </li>
          <li>capital {country.capital[0]}</li>
          <li>area {country.area}</li>
          <li>
            <h3>languages:</h3>
            <ul className="languages">
              {Object.keys(country.languages).map((key, index) => (
                <li key={index}>
                  {key}: {country.languages[key]}
                </li>
              ))}
            </ul>
          </li>
          <li>
            <img src={country.flags.svg} alt="Country flag" width="150" />
          </li>
          <li>
            <h3>Weather in {country.capital}</h3>
          </li>
          <li>temperature {weather.main?.temp} Celsius</li>
          {weather.weather && weather.weather[0] && (
            <li>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Weather icon"
              />
            </li>
          )}
          <li>wind {weather.wind?.speed} m/s</li>
        </ul>
      );
    }

    if (countries.length > 1 && countries.length <= 10) {
      return countries.map((country) => (
        <li key={country.cca3}>
          <span>{country.name.common}</span>{" "}
          <button onClick={showCountry(country.name.common)}>show</button>
        </li>
      ));
    }
  };

  return (
    <div>
      <div>
        find countries <input type="text" onChange={handleCountries} />
      </div>
      <ul>{searchReturn(search)}</ul>
    </div>
  );
};

export default App;
