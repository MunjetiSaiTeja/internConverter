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

// Function to populate dropdown with currencies
function populateDropdown(currenciesArray, dropdown) {
    dropdown.innerHTML = ""; // Clear previous dropdown options

    currenciesArray.forEach(currency => {
        const option = document.createElement("div");
        option.textContent = `${currency.code} - ${currency.country}`; // Combine code and country
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
