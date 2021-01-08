require("dotenv").config();
const { CronJob } = require("cron");

const { APIFactory } = require("./api");

const job = new CronJob(process.env.CRON, function () {
  console.log("You will see this message every second");
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

API.get("/order").then(console.log).catch(console.log);
API.get("/trading/balance").then(console.log).catch(console.log);

// test
// API.get("/order/{id}", { query: { test: 123 }, params: { id: 123123 } })
//   .then(console.log)
//   .catch(console.log);
