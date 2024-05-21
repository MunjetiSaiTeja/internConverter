const currencies = [
    { code: "INR", country: "India" },
    { code: "USD", country: "United States" },
    { code: "EUR", country: "Germany" },
    { code: "GBP", country: "United Kingdom" },
    { code: "JPY", country: "Japan" },
    { code: "CAD", country: "Canada" },
    { code: "AUD", country: "Australia" },
    { code: "CHF", country: "Switzerland" },
    { code: "CNY", country: "China" },
    { code: "HKD", country: "Hong Kong" },
    { code: "NZD", country: "New Zealand" },
    { code: "SEK", country: "Sweden" },
    { code: "KRW", country: "South Korea" },
    { code: "SGD", country: "Singapore" },
    { code: "NOK", country: "Norway" },
    { code: "MXN", country: "Mexico" }
    // Add more currencies as needed
];


const fromCurrencyInput = document.getElementById("fromCurrencyInput");
const fromCurrencyDropdown = document.getElementById("fromCurrencyDropdown");
const toCurrencyInput = document.getElementById("toCurrencyInput");
const toCurrencyDropdown = document.getElementById("toCurrencyDropdown");

// Function to filter currencies based on input
function filterCurrencies(type) {
    let input, dropdown;
    if (type === 'from') {
        input = fromCurrencyInput.value.toUpperCase();
        dropdown = fromCurrencyDropdown;
    } else if (type === 'to') {
        input = toCurrencyInput.value.toUpperCase();
        dropdown = toCurrencyDropdown;
    } else {
        return;
    }

    const filteredCurrencies = currencies.filter(currency => {
        return currency.code.toUpperCase().includes(input) || currency.country.toUpperCase().includes(input);
    });

    populateDropdown(filteredCurrencies, dropdown);
}

function populateDropdown(currenciesArray, dropdown) {
    dropdown.innerHTML = ""; // Clear previous dropdown options

    currenciesArray.forEach(currency => {
        const option = document.createElement("div");
        const flagUrl = getFlagUrl(currency.country); // Get flag image URL based on country name
        if (flagUrl) {
            const flagImg = document.createElement("img");
            flagImg.src = flagUrl;
            flagImg.alt = `${currency.country} Flag`;
            flagImg.classList.add("flag-image");
            option.appendChild(flagImg);
        }
        option.innerHTML += `${currency.code} - ${currency.country}`; // Combine code and country
        option.classList.add("dropdown-option");
        option.addEventListener("click", function() {
            if (dropdown === fromCurrencyDropdown) {
                fromCurrencyInput.value = currency.code;
            } else if (dropdown === toCurrencyDropdown) {
                toCurrencyInput.value = currency.code;
            }
            dropdown.style.display = "none"; // Hide dropdown after selection
        });
        dropdown.appendChild(option);
    });

    // Show dropdown
    dropdown.style.display = "block";
}

function initializeDropdowns() {
    populateDropdown(currencies, fromCurrencyDropdown);
    populateDropdown(currencies, toCurrencyDropdown);
}

// Add event listener to the down arrow buttons to initialize dropdowns and toggle visibility
document.getElementById("fromCurrencyDropdown").previousElementSibling.addEventListener('click', function() {
    initializeDropdowns();
    toggleDropdown('from');
});

document.getElementById("toCurrencyDropdown").previousElementSibling.addEventListener('click', function() {
    initializeDropdowns();
    toggleDropdown('to');
});

// Function to exchange currencies
function exchangeCurrencies() {
    const temp = fromCurrencyInput.value;
    fromCurrencyInput.value = toCurrencyInput.value;
    toCurrencyInput.value = temp;
}

async function fetchExchangeRate(fromCurrency, toCurrency) {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        return data.rates[toCurrency];
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return null;
    }
}

async function convert() {
    // Retrieve the amount and currencies from the input fields
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = fromCurrencyInput.value.toUpperCase();
    const toCurrency = toCurrencyInput.value.toUpperCase();

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid positive amount.");
        return;
    }

    // Fetch exchange rate
    const exchangeRate1 = await fetchExchangeRate(fromCurrency, toCurrency);
    const exchangeRate2 = await fetchExchangeRate(toCurrency, fromCurrency);
    if (exchangeRate1 !== null && exchangeRate2 !== null) {
        // Calculate converted amount
        const convertedAmount = amount * exchangeRate1;

        // Display the result
        document.getElementById("result").innerText = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } else {
        // Display error message
        document.getElementById("result").innerText = "Please enter a valid currency.";
    }
}

document.body.addEventListener('click', function(event) {
    const target = event.target;
    const isFromCurrencyInput = target.id === 'fromCurrencyInput' || target.id === 'fromCurrencyDropdown';
    const isToCurrencyInput = target.id === 'toCurrencyInput' || target.id === 'toCurrencyDropdown';
    
    if (!isFromCurrencyInput) {
        fromCurrencyDropdown.style.display = 'none';
    }
    
    if (!isToCurrencyInput) {
        toCurrencyDropdown.style.display = 'none';
    }
});

fromCurrencyInput.addEventListener("input", function() {
    this.value = this.value.toUpperCase();
    filterCurrencies('from'); // Filter currencies as the user types
});

toCurrencyInput.addEventListener("input", function() {
    this.value = this.value.toUpperCase();
    filterCurrencies('to'); // Filter currencies as the user types
});

function getFlagUrl(countryName) {
    // Convert country name to lowercase for case-insensitive matching
    const lowercaseCountryName = countryName.toLowerCase();
    
    switch(lowercaseCountryName) {
        case "india":
            return "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg";
        case "united states":
            return "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg";
        case "germany":
            return "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg";
        case "united kingdom":
            return "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg";
        case "japan":
            return "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg";
        case "canada":
            return "https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg";
        case "australia":
            return "https://upload.wikimedia.org/wikipedia/en/b/b9/Flag_of_Australia.svg";
        case "switzerland":
            return "https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Switzerland_%28Pantone%29.svg";
        case "china":
            return "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg";
        case "hong kong":
            return "https://upload.wikimedia.org/wikipedia/commons/5/5b/Flag_of_Hong_Kong.svg";
        case "new zealand":
            return "https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg";
        case "sweden":
            return "https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg";
        case "south korea":
            return "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg";
        case "singapore":
            return "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Singapore.svg";
        case "norway":
            return "https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg";
        case "mexico":
            return "https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg";
        default:
            return ""; // Return empty string if flag URL not found
    }
}
document.getElementById('exchangeButton').addEventListener('click', function() {
            this.classList.toggle('rotated');
        });
