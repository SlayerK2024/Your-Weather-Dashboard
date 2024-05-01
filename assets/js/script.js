const searchbutton = document.getElementById('search-button');
const apiKey = "40829e2f98182b6a5326a4166a689b64"
let city;
const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;


// Save the city to local storage
function saveCityToLocalStorage(city) {
  let cities = JSON.parse(localStorage.getItem('searchedCities')) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('searchedCities', JSON.stringify(cities));
  }
}

//Event listener for the search button click
document.getElementById('searchButton').addEventListener('click', function() {
  const city = document.getElementById('cityInput').value;
  saveCityToLocalStorage(city);
});



fetch(queryURL)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  document.getElementById('main-name').textContent = data.name;
  // Note: The icon URL should be constructed using the icon code provided by the API
  document.getElementById('main-icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">`;
  // Temperature in Kelvin needs to be converted to Celsius
  document.getElementById('main-temp').textContent = `Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C`;
  document.getElementById('main-wind').textContent = `Wind: ${data.wind.speed} m/s`;
  document.getElementById('main-humidity').textContent = `Humidity: ${data.main.humidity}%`;
})
.catch(error => {
  console.error('Error fetching weather data:', error);
  // Display a user-friendly error message on the UI
  document.getElementById('main-name').textContent = 'Weather data unavailable';
});