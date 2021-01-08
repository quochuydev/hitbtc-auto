const cron = require("cron");
const request = require("request");

var CronJob = require("cron").CronJob;
var job = new CronJob("* * * * * *", function () {
  console.log("You will see this message every second");
});
job.start();
