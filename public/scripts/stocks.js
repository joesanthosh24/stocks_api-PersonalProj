var socket = io();
var connected = true;

socket.on("price_update", (data) => {
  const { stocks, time } = data;

  for (let i = 0; i < stocks.length; i++) {
    const { price, ticker } = stocks[i];

    const li = document.createElement("li");
    li.className = "stock-price";
    li.innerHTML = `At ${time}: <span class='stock-value'>$${price}</span>`;

    const ul = document.querySelector(`.stockContainer#${ticker} .prices`);
    ul.appendChild(li);
  }
});

const connectButton = document.querySelector(".btn-success");
const disconnectButton = document.querySelector(".btn-danger");

connectButton.setAttribute("disabled", "true");
connectButton.classList.add("disabled");

disconnectButton.addEventListener("click", () => {
  socket.disconnect();
  connected = false;
  disconnectButton.setAttribute("disabled", "true");
  disconnectButton.classList.add("disabled");
  connectButton.removeAttribute("disabled");
  connectButton.classList.remove("disabled");
});
connectButton.addEventListener("click", () => {
  socket.connect();
  connected = true;
  disconnectButton.removeAttribute("disabled", "false");
  disconnectButton.classList.remove("disabled");
  connectButton.setAttribute("disabled", "true");
  connectButton.classList.add("disabled");
});
