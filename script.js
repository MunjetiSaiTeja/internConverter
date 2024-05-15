const currencies = [
    "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY",
    "HKD", "NZD", "SEK", "KRW", "SGD", "NOK", "MXN", "INR"
];
const fromCurrencyInput = document.getElementById("fromCurrencyInput");
const fromCurrencyDropdown = document.getElementById("fromCurrencyDropdown");
const toCurrencyInput = document.getElementById("toCurrencyInput");
const toCurrencyDropdown = document.getElementById("toCurrencyDropdown");
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
    const filteredCurrencies = currencies.filter(currency => currency.includes(input));
    populateDropdown(filteredCurrencies, dropdown);
}
function populateDropdown(currenciesArray, dropdown) {
    dropdown.innerHTML = ""; 
    currenciesArray.forEach(currency => {
        const option = document.createElement("div");
        option.textContent = currency;
        option.classList.add("dropdown-option");
        option.addEventListener("click", function() {
            if (dropdown === fromCurrencyDropdown) {
                fromCurrencyInput.value = currency;
            } else if (dropdown === toCurrencyDropdown) {
                toCurrencyInput.value = currency;
            }
            dropdown.style.display = "none"; // Hide dropdown after selection
        });
        dropdown.appendChild(option);
    });
    dropdown.style.display = "block";
}
function initializeDropdowns() {
    populateDropdown(currencies, fromCurrencyDropdown);
    populateDropdown(currencies, toCurrencyDropdown);
}
document.getElementById("fromCurrencyDropdown").previousElementSibling.addEventListener('click', function() {
    initializeDropdowns();
    toggleDropdown('from');
});
document.getElementById("toCurrencyDropdown").previousElementSibling.addEventListener('click', function() {
    initializeDropdowns();
    toggleDropdown('to');
});
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
    const exchangeRate1 = await fetchExchangeRate(fromCurrency, toCurrency);
    const exchangeRate2 = await fetchExchangeRate(toCurrency, fromCurrency);
    if (exchangeRate1 !== null && exchangeRate2 !== null) {
        const convertedAmount = amount * exchangeRate1;
        document.getElementById("result").innerText = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } else {
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
    filterCurrencies('from');
});

toCurrencyInput.addEventListener("input", function() {
    this.value = this.value.toUpperCase();
    filterCurrencies('to'); // Filter currencies as the user types
});
