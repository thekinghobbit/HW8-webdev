document.getElementById('weather-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // prevent the form from submitting the traditional way

    const city = document.getElementById('city').value; // get the city value
    const state = document.getElementById('state').value; // get the state value

    if (!city || !state) {
        displayError('City and state are required.'); // complain if city or state is missing
        return;
    }

    try {
        // Get weather data
        const response = await fetch(`/weather?city=${city}&state=${state}`);
        const weatherData = await response.json();

        if (!response.ok) {
            throw new Error(weatherData.error); // complain if the response is not ok
        }

        // Display weather data
        document.getElementById('temperature').textContent = `Temperature: ${weatherData.temperature} °F`;
        document.getElementById('description').textContent = `Description: ${weatherData.description}`;
        document.getElementById('wind-speed').textContent = `Wind Speed: ${weatherData.windSpeed} mph`;
        document.getElementById('condition').textContent = `Condition: ${weatherData.condition}`;

        // Display weather icon
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.src = `icons/${weatherData.condition.toLowerCase()}.svg`;
        weatherIcon.alt = weatherData.condition;
        weatherIcon.style.display = 'block';

        // Change background color animation
        document.body.className = ''; // Reset any existing class
        document.body.classList.add(getBackgroundAnimation(weatherData.condition));
    } catch (error) {
        displayError(error.message); // display the error message
    }
});

function displayError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message; // set the error message
    errorElement.style.display = 'block'; // show the error message
}

function getBackgroundAnimation(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
            return 'clearWeather'; // animation for clear weather
        case 'clouds':
            return 'cloudyWeather'; // animation for cloudy weather
        case 'rain':
            return 'rainyWeather'; // animation for rainy weather
        case 'snow':
            return 'snowyWeather'; // animation for snowy weather
        case 'thunderstorm':
            return 'thunderstormWeather'; // animation for thunderstorms
        default:
            return ''; // no animation for everything else
    }
}