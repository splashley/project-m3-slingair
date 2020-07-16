const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const errorMessage = document.getElementById("error");

let selection = "";

// Render the seats based on availability
const renderSeats = (data) => {
  document.querySelector(".form-container").style.display = "block";

  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      // TODO: render the seat availability based on the data...
      const getAvailableSeat = data.find((seat) => seat.id === seatNumber);
      if (!getAvailableSeat.isAvailable) {
        seat.innerHTML = seatOccupied;
      } else {
        seat.innerHTML = seatAvailable;
      }
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      document.getElementById("seat-number").value = `${selection}`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = async (event) => {
  const flightNumber = flightInput.value;
  const regex = /[S][A][0-9][0-9][0-9]$/g;
  if (flightNumber.match(regex)) {
    fetch(`/flights/${flightNumber}`)
      .then((response) => response.json())
      .then((data) => {
        renderSeats(data);
      });
  } else {
    alert("This flight does not exists");
  }
};

// Creates a POST request after submitting info
const handleConfirmSeat = async (event) => {
  event.preventDefault();
  const response = await fetch("/users", {
    method: "POST",
    body: JSON.stringify({
      givenName: document.getElementById("givenName").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      seat: document.getElementById("seat-number").value,
      flight: document.getElementById("flight").value,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // Verify that a seat has been selected
  const data = await response.json();
  console.log(document.getElementById("seat-number").value);
  if (document.getElementById("seat-number").value === undefined) {
    errorMessage.innerText = "You must select a seat";
  } else {
    window.location = `/seat-select/confirmed.html?userId=${data.id}`;
  }
};

flightInput.addEventListener("blur", toggleFormContent);
