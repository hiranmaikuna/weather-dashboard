async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    if (city === "") {
        error.textContent = "Please enter a city name.";
        return;
    }

    loading.textContent = "Loading weather...";
    error.textContent = "";

    try {

        // Get latitude and longitude of the city
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Network error");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = geoData.results[0];

        // Get current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data");
        }

        const weatherData = await weatherResponse.json();

        // Display weather information
        document.getElementById("cityName").textContent =
            location.name + ", " + (location.country || "");

        document.getElementById("temperature").textContent =
            weatherData.current.temperature_2m;

        document.getElementById("humidity").textContent =
            weatherData.current.relative_humidity_2m;

        document.getElementById("wind").textContent =
            weatherData.current.wind_speed_10m;

    } catch (err) {

        error.textContent = "Error: " + err.message;

    } finally {

        loading.textContent = "";
    }
}