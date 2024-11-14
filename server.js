import express from 'express'; // importing express, because we need it
import fetch from 'node-fetch'; // importing fetch, because we need to fetch stuff
import dotenv from 'dotenv'; // importing dotenv, because we need environment variables

dotenv.config(); // load environment variables from .env file

const app = express(); // creating an express app
const PORT = process.env.PORT || 3000; // setting the port, default to 3000 if not specified
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY; // getting the API key from environment variables

if (!OPENWEATHER_API_KEY) {
    console.error('Error: OPENWEATHER_API_KEY is not defined in .env file'); // complain if the API key is missing
    process.exit(1); // exit the process because we can't do anything without the API key
}

app.use(express.static('public')); // serve static files from the 'public' directory

// Route to get weather data based on city and state
app.get('/weather', async (req, res) => {
    const { city, state } = req.query; // get city and state from query parameters

    if (!city || !state) {
        return res.status(400).json({ error: 'City and state are required' }); // complain if city or state is missing
    }

    const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    console.log(`Geocode URL: ${geocodeUrl}`); // log the geocode URL for debugging

    try {
        const geocodeResponse = await fetch(geocodeUrl); // fetch geocode data
        const geocodeData = await geocodeResponse.json(); // parse the JSON response

        if (geocodeData.length === 0) {
            return res.status(404).json({ error: 'Location not found' }); // complain if location is not found
        }

        const { lat, lon } = geocodeData[0]; // get latitude and longitude from the response
        const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`;

        const weatherResponse = await fetch(weatherUrl); // fetch weather data
        const weatherData = await weatherResponse.json(); // parse the JSON response

        const weatherInfo = {
            temperature: weatherData.main.temp, // get temperature
            description: weatherData.weather[0].description, // get weather description
            windSpeed: weatherData.wind.speed, // get wind speed
            condition: weatherData.weather[0].main // get weather condition
        };

        res.json(weatherInfo); // send the weather info as JSON
    } catch (error) {
        console.error('Error fetching weather data:', error); // log the error
        res.status(500).json({ error: 'Failed to fetch weather data' }); // complain if something goes wrong
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // log that the server is running
});