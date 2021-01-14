const WebSocket = require("ws");
const _ = require("lodash");

const withData = (listener) =>
  _.pipe(_.get(`data`), (dataString) => JSON.parse(dataString), listener);

module.exports = () => {
  const marketUrl = "wss://api.hitbtc.com/api/2/ws/public";
  // const marketUrl = "wss://api.demo.hitbtc.com/api/2/ws/public";
  //   wss://api.demo.hitbtc.com/api/2/ws/trading

  const ws = new WebSocket(marketUrl);
  ws.on("open", function (evt) {
    setInterval(() => {
      //
      ws.send(
        JSON.stringify({
          method: "getTrades",
          params: {
            symbol: "BTCUSD",
            limit: 5,
            // sort: "DESC",
            by: "id",
          },
          id: 123,
        })
      );
    }, 1000);
  });

  ws.on("message", function (data) {
    data = JSON.parse(data);
    const result = data.result
      ? JSON.stringify(data.result.data.map((e) => e.price))
      : null;
    result && console.log(new Date().toISOString(), result);
  });
};
