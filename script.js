const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    try {
        if (!countryName) return;

        
        errorMessage.classList.add('hidden');
        countryInfo.classList.add('hidden');
        borderingCountries.classList.add('hidden');
        borderingCountries.innerHTML = '';

        
        loadingSpinner.classList.remove('hidden');

        
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        countryInfo.classList.remove('hidden');

        
        if (country.borders && country.borders.length > 0) {
            borderingCountries.classList.remove('hidden');

            for (const borderCode of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountries.innerHTML += `
                    <div class="border-country">
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                    </div>
                `;
            }
        } else {
            borderingCountries.classList.remove('hidden');
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent = "Country not found. Please try again.";
        errorMessage.classList.remove('hidden');
    } finally {
        
        loadingSpinner.classList.add('hidden');
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    searchCountry(country);
});

countryInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const country = countryInput.value.trim();
        searchCountry(country);
    }
});