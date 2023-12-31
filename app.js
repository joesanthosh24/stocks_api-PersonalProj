const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const stocks = [
  { ticker: "NDAQ", name: "Nasdaq" },
  { ticker: "DJIA", name: "Dow Jones Industrial Average" },
  { ticker: "SPX", name: "S&P 500 Index" },
];

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Real Time Stocks",
    stocks,
  });
});

app.get("/stocks/:ticker", (req, res) => {
  const { ticker } = req.params;

  const { ticker: stockTicker, name } = stocks.filter(
    (stock) => stock.ticker === ticker
  )[0];

  res.render("stock", {
    pageTitle: name + " Stock",
    stockName: name,
    ticker: stockTicker,
  });
});

io.on("connection", (socket) => {
  console.log("Connected");

  const formatAsPrice = (val) => {
    return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const interval = setInterval(() => {
    const ndaqStock = formatAsPrice(Math.random() * 899999999);
    const djiaStock = formatAsPrice(Math.random() * 899999999);
    const spxStock = formatAsPrice(Math.random() * 899999999);

    socket.emit("price_update", {
      time: new Date().toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      stocks: [
        { ticker: "NDAQ", price: ndaqStock },
        { ticker: "DJIA", price: djiaStock },
        { ticker: "SPX", price: spxStock },
      ],
    });
  }, 1000);
  socket.on("disconnect", () => {
    console.log("User Disconnected");
    clearInterval(interval);
  });
});

server.listen(8080, () => {
  console.log("Listening on port 8080");
});
