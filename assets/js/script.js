const searchButton = document.getElementById('searchButton');
const apiKey = "40829e2f98182b6a5326a4166a689b64";

// Event listener for the search button click
searchButton.addEventListener('click', async function() {
  const city = document.getElementById('city').value.trim();
  
  if (city === '') {
    alert('Please enter a city name.');
    return;
  }

  try {
    // Save the city to local storage
    saveCityToLocalStorage(city);

    // Fetch weather data
    const weatherData = await fetchWeatherData(city);
    
    // Update UI with weather data
    updateWeatherUI(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    displayErrorMessage();
  }
});

// Function to fetch weather data
async function fetchWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Weather data not available');
  }
  
  const data = await response.json();
  return data;
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
  document.getElementById('main-name').textContent = data.name;
  document.getElementById('main-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">`;
  document.getElementById('main-temp').textContent = `Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C`;
  document.getElementById('main-wind').textContent = `Wind: ${data.wind.speed} m/s`;
  document.getElementById('main-humidity').textContent = `Humidity: ${data.main.humidity}%`;
}

// Function to display an error message on the UI
function displayErrorMessage() {
  document.getElementById('main-name').textContent = 'Weather data unavailable';
  // Optionally, you can clear other weather-related elements or display additional error information.
}

// Function to save the city to local storage
function saveCityToLocalStorage(city) {
  let cities = JSON.parse(localStorage.getItem('searchedCities')) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('searchedCities', JSON.stringify(cities));
  }
}

// Function to display the list of searched cities on the webpage
function displaySearchedCities() {
  let cities = JSON.parse(localStorage.getItem('searchedCities')) || [];
  const searchedCitiesList = document.getElementById('searchedCitiesList');
  searchedCitiesList.innerHTML = ''; // Clear previous list

  cities.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    searchedCitiesList.appendChild(listItem);
  });
}

// Initial display of searched cities
displaySearchedCities();

