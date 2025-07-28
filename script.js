const distance = document.getElementById("distance");
const averageConsumption = document.getElementById("averageConsumption");
const price = document.getElementById("price");
const button = document.querySelector("#calculate");
const div = document.querySelector("#result");
const error = document.querySelector(".error");

// Odczyt danych z localStorage (jeśli są)
if (localStorage.getItem("distance")) {
  distance.value = localStorage.getItem("distance");
}
if (localStorage.getItem("averageConsumption")) {
  averageConsumption.value = localStorage.getItem("averageConsumption");
}
if (localStorage.getItem("price")) {
  price.value = localStorage.getItem("price");
}

// Historia przejazdów (koszty)
let fuelHistory = JSON.parse(localStorage.getItem("fuelHistory")) || [];

// Inicjalizacja wykresu
const ctx = document.getElementById("fuelChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: fuelHistory.map((_, i) => `Przejazd ${i + 1}`),
    datasets: [
      {
        label: "Koszt paliwa (zł)",
        data: fuelHistory,
        backgroundColor: "rgba(135, 28, 185, 0.2)",
        borderColor: "rgba(150, 94, 21, 1)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

button.addEventListener("click", function () {
  if (!distance.value || !averageConsumption.value || !price.value) {
    error.innerHTML = "Uzupełnij wszystkie pola!";
    div.innerHTML = "";
  } else {
    error.innerHTML = "";

    const result = (distance.value * averageConsumption.value) / 100;
    const gasPrice = result * price.value;

    // Zapis danych do localStorage
    localStorage.setItem("distance", distance.value);
    localStorage.setItem("averageConsumption", averageConsumption.value);
    localStorage.setItem("price", price.value);

    // Zapis do historii
    fuelHistory.push(gasPrice);
    if (fuelHistory.length > 8) {
      fuelHistory.shift(); // zachowaj tylko ostatnie 5 wyników
    }
    localStorage.setItem("fuelHistory", JSON.stringify(fuelHistory));

    // Aktualizacja wykresu
    chart.data.labels = fuelHistory.map((_, i) => `Przejazd ${i + 1}`);
    chart.data.datasets[0].data = fuelHistory;
    chart.update();

    // Wynik tekstowy
    div.innerHTML = `<p>Zużycie paliwa: ${result.toFixed(2)} litrów.</p>
                     <p>Koszt: ${gasPrice.toFixed(2)} zł</p>`;
  }
});
