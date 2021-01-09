require("dotenv").config();
const { CronJob } = require("cron");
const _ = require("lodash");

const { APIFactory } = require("./api");

const changes = []
let buyChanges = []
const sellChanges = []

const job = new CronJob(process.env.CRON, function () {
  // ETHUSD
  // EOSUSD
  API.get("/public/trades/ETHUSD")
    .then((res) => {
      // console.log(new Date().toISOString(), res[0]);
      buyChanges.push(res[0].price)
      buyChanges = _.takeRight(buyChanges, 5)
      console.log(buyChanges)
    })
    .catch(console.log);
});
job.start();

// https://demo.hitbtc.com/settings/api-keys
const API = APIFactory({
  baseUrl:
    process.env.LIVE === "1"
      ? "https://api.hitbtc.com/api/2"
      : "https://api.demo.hitbtc.com/api/2",
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
});

API.get("/order")
  .then((res) => {
    console.log(res);
  })
  .catch(console.log);
API.get("/trading/balance").then(console.log).catch(console.log);

// test
// API.post("/order", {
//   body: {
//     symbol: "EOSUSD",
//     side: "buy",
//     type: "market",
//     quantity: 1,
//   },
//   showLog: true
// })
//   .then(console.log)
//   .catch(console.log);
