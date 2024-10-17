import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  faWind,
  faCloud,
  faTemperatureHigh,
  faTemperatureLow,
  faTint,
} from "@fortawesome/free-solid-svg-icons";
import "./WeatherCard.css";

const WeatherCard: React.FC = () => {
  const [location, setLocation] = useState("");
  const [weatherDetails, setWeatherDetails] = useState({
    maxTemp: 19,
    minTemp: 15,
    humidity: 58,
    description: "Snow",
    wind: "5km/h",
    time: "06:09 - Monday, 9 Sept '23",
    onlyTime: "06:09",
    location: "London",
  });
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch weather data based on the provided location
  const fetchWeatherData = async (lat?: number, lon?: number) => {
    const locationParam = lat && lon ? `${lat},${lon}` : location;
    if (!locationParam) return;

    try {
      // Fetching weather data
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=742711a164964e5f97894833241710&q=${locationParam}`
      );

      if (response.status === 200) {
        setWeatherDetails({
          maxTemp: response.data.current.temp_c,
          minTemp: response.data.current.feelslike_c,
          humidity: response.data.current.humidity,
          description: response.data.current.condition.text,
          wind: `${response.data.current.wind_kph} km/h`,
          time: new Date().toLocaleString(),
          onlyTime: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          location: response.data.location.name,
        });
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data");
    }
  };

  // New function for reverse geocoding
  const getLocationFromCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=ee40887765924dfe8747500510dd4368`
      );

      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted;
        await fetchWeatherData(lat, lon); // Call weather data with coordinates
        setLocation(address); // Update location state with address
      } else {
        alert("Could not retrieve location details.");
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      alert("Error fetching location details");
    }
  };

  // Modify fetchWeatherByGeolocation to include reverse geocoding
  const fetchWeatherByGeolocation = async () => {
    if (navigator.geolocation) {
      setLoading(true); // Set loading to true before fetching geolocation
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await getLocationFromCoordinates(latitude, longitude); // Get address and weather
          setLoading(false); // Set loading to false after fetching
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve your location.");
          setLoading(false); // Set loading to false on error
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false); // Set loading to false if geolocation is not supported
    }
  };

  // Call geolocation on component mount
  useEffect(() => {
    fetchWeatherByGeolocation();
  }, []);

  return (
    <div className="weather-container">
      {loading ? ( // Show loader when loading
        <div className="loader">
          <div className="loader-circle"></div>
        </div>
      ) : (
        <div className="weather-content">
          <div className="logo-wrapper">
            <img src="/logo.png" alt="Logo" className="logo" />
          </div>
          <div className="weather-info">
            <h2 className="weather-large-text">
              {`${weatherDetails.maxTemp}°`}
              <FontAwesomeIcon icon={faCloud} style={{ marginLeft: "10px" }} />
            </h2>
            <div className="weather-align">
              <span className="weather-heading">{`${weatherDetails.location}`}</span>
              <span className="weather-caption">{weatherDetails.time}</span>
            </div>
          </div>

          <div className="weather-details">
            <div className="search-bar-wrapper">
              <input
                type="text"
                className="search-bar"
                placeholder="Search Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchWeatherData();
                  }
                }}
              />
              <button
                className="search-icon-btn"
                onClick={() => fetchWeatherData()}
              >
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
              </button>
            </div>
            <p className="weather-caption">Weather Details...</p>
            <h3 className="weather-sub-heading">
              {weatherDetails.description}
            </h3>
            <div className="detail">
              <span className="weather-text">Temp Max:</span>
              <div className="data-icon-wrapper">
                <span>{`${weatherDetails.maxTemp}°`}</span>
                <FontAwesomeIcon
                  icon={faTemperatureHigh}
                  className="detail-icon"
                  style={{ color: "#DFA1A1" }}
                />
              </div>
            </div>
            <div className="detail">
              <span className="weather-text">Temp Feel:</span>
              <div className="data-icon-wrapper">
                <span>{`${weatherDetails.minTemp}°`}</span>
                <FontAwesomeIcon
                  icon={faTemperatureLow}
                  className="detail-icon"
                  style={{ color: "#6D97CA" }}
                />
              </div>
            </div>
            <div className="detail">
              <span className="weather-text">Humidity:</span>
              <div className="data-icon-wrapper">
                <span>{`${weatherDetails.humidity}%`}</span>
                <FontAwesomeIcon icon={faTint} className="detail-icon" />
              </div>
            </div>
            <div className="detail">
              <span className="weather-text">Wind:</span>
              <div className="data-icon-wrapper">
                <span>{`${weatherDetails.wind}`}</span>
                <FontAwesomeIcon icon={faWind} className="detail-icon" />
              </div>
            </div>
            <div className="separator"></div>
            <h4 className="weather-title weather-caption">
              Today's Weather Forecast...
            </h4>
            <div className="weather-detail">
              <div className="left-block">
                <div className="icon snowflake">&#x2744;</div>
                <div className="text-block">
                  <span className="time weather-sub-heading">{`${weatherDetails.onlyTime}`}</span>
                  <span className="condition weather-text">{`${weatherDetails.description}`}</span>
                </div>
              </div>
              <div className="temperature temp-text">{`${weatherDetails.maxTemp}°`}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
