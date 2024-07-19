const apiKey = "40829e2f98182b6a5326a4166a689b64";
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('city');
const mainName = document.getElementById('main-name');
const mainIcon = document.getElementById('main-icon');
const mainTemp = document.getElementById('main-temp');
const mainWind = document.getElementById('main-wind');
const mainHumidity = document.getElementById('main-humidity');
const searchedCitiesList = document.getElementById('searchedCitiesList');


// Event listener for the search button click
searchButton.addEventListener('click', function() {
  const city = document.getElementById('city').value;
  const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // Save the city to local storage
  saveCityToLocalStorage(city);

  fetch(queryURL)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  mainName.textContent = data.name;
  mainIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">`;
  mainTemp.textContent = `Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C`;
  mainWind.textContent = `Wind: ${data.wind.speed} m/s`;
  mainHumidity.textContent = `Humidity: ${data.main.humidity}%`;
})
    .catch(error => {
      console.error('Error fetching weather data:', error);
      document.getElementById('main-name').textContent = 'Weather data unavailable';
    });
});

// Function to fetch location coordinates
async function getLocationCoordinates(city, state, country) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${apiKey}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      return { lat: data[0].lat, lon: data[0].lon };
  } catch (error) {
      console.error('Error fetching location coordinates:', error);
  }
}

// Function to fetch 5-day forecast
async function getFiveDayForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      return data.daily; 
  } catch (error) {
      console.error('Error fetching 5-day forecast:', error);
  }
}

// Example usage
async function displayFiveDayForecast(city, state, country) {
  const { lat, lon } = await getLocationCoordinates(city, state, country);
  const forecastData = await getFiveDayForecast(lat, lon);

  // Display forecast data on your webpage
  console.log('5-day forecast:', forecastData);
}
displayFiveDayForecast('London', '', 'GB');


// Save the city to local storage
function saveCityToLocalStorage(city) {
  let cities = JSON.parse(localStorage.getItem('searchedCities')) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('searchedCities', JSON.stringify(cities));
  }
}

// Array to store searched cities
let searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

// Function to display the list of searched cities on the webpage
function displaySearchedCities() {
  searchedCitiesList.innerHTML = ''; // Clear previous list

  searchedCities.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    searchedCitiesList.appendChild(listItem);
  });
}
// Call addSearchedCity when a user searches for a city
addSearchedCity('London');
addSearchedCity('Paris');
addSearchedCity('New York');

// Call displaySearchedCities to display the list on your webpage
displaySearchedCities();
