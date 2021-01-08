const request = require("request");

const APIFactory = ({ baseUrl, apiKey, secretKey }) => {
  const credentials = Buffer.from(apiKey + ":" + secretKey).toString("base64");

  const call = (endpoint, method, config = {}, data) => {
    return new Promise((resolve) => {
      const url = baseUrl + endpoint;
      if (config.query) {
        const objQuery = config.query;
        const query = Object.keys(objQuery)
          .map((key) => {
            if (objQuery[key]) {
              return key + "=" + objQuery[key];
            }
          })
          .filter((e) => !!e)
          .join("&");
        if (query) {
          url = `${url}?${query}`;
        }
      }

      const options = {
        url,
        method,
        headers: {
          Authorization: "Basic " + credentials,
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      request(options, function (err, res, result) {
        console.log(options.method, options.url, res.statusCode);
        resolve(result);
      });
    });
  };

  const API = {
    get: async (endpoint, config) => {
      return await call(endpoint, "GET", config);
    },

    post: async (endpoint, data, config) => {
      return await call(endpoint, "POST", config, data);
    },
  };
  return API;
};

module.exports = { APIFactory };
