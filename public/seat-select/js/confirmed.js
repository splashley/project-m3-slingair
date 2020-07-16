const flightSpan = document.querySelector("#flight");
const seatSpan = document.querySelector("#seat");
const nameSpan = document.querySelector("#name");
const emailSpan = document.querySelector("#email");

// Get the information from the POST request and add it to the confirmation page
const getUserInfo = async () => {
  let userId = window.location.search.split("=")[1];
  let response = await fetch(`/seat-select/confirmation/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  let data = await response.json();
  nameSpan.innerText = `${data.givenName} ${data.surname}`;
  emailSpan.innerText = `${data.email}`;
  flightSpan.innerText = `${data.flight}`;
  seatSpan.innerText = `${data.seat}`;
};

getUserInfo();
