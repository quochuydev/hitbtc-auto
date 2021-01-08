require("dotenv").config();
const { CronJob } = require("cron");

const { APIFactory } = require("./api");

const job = new CronJob(process.env.CRON, function () {
  console.log("You will see this message every second");
});
job.start();

const API = APIFactory({
  baseUrl: "https://api.demo.hitbtc.com/api/2",
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
});

API.get("/order", { query: 123 }).then(console.log).catch(console.log);
API.get("/trading/balance").then(console.log).catch(console.log);
