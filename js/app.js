const status = document.getElementById("status");
const forecastContainer = document.getElementById("forecast");

const findMe = () => {
  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  status.textContent = "Locating...";

  navigator.geolocation.getCurrentPosition(success, error);
};

const success = async (position) => {
  const { latitude, longitude } = position.coords;
  status.textContent = `Location found: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

  try {
    const pointsRes = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
    const pointsData = await pointsRes.json();
    const forecastUrl = pointsData.properties.forecast;

    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();
    const periods = forecastData.properties.periods;

    renderForecast(periods);
  } catch (err) {
    console.error(err);
    status.textContent = "Error fetching forecast data.";
  }
};

const error = () => {
  status.textContent = "Unable to retrieve your location.";
};

const renderForecast = (periods) => {
  forecastContainer.innerHTML = "";

  periods.slice(0, 7).forEach((day) => {
    const card = document.createElement("div");
    card.className = "card col-md-3 m-2 p-2 text-center";

    card.innerHTML = `
      <h5>${day.name}</h5>
      <img src="${day.icon}" alt="${day.shortForecast}" class="img-fluid" />
      <p><strong>${day.temperature}° ${day.temperatureUnit}</strong></p>
      <p>${day.shortForecast}</p>
    `;

    forecastContainer.appendChild(card);
  });
};