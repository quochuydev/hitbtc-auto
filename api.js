const request = require("request");
const _ = require("lodash");

const APIFactory = ({ baseUrl, apiKey, secretKey }) => {
  const credentials = Buffer.from(apiKey + ":" + secretKey).toString("base64");

  const API = {
    get: async (endpoint, config) => {
      return await call(endpoint, "GET", config);
    },

    post: async (endpoint, config) => {
      return await call(endpoint, "POST", config);
    },
  };

  return API;

  function call(endpoint, method, config = {}) {
    return new Promise((resolve, reject) => {
      const url = makeUrl(endpoint, config);
      const headers = {
        Authorization: "Basic " + credentials,
      };

      if (config.body) {
        options.body = JSON.stringify(config.body);
      }

      const options = {
        url,
        method,
        headers,
      };

      request(options, function (err, res, body) {
        console.log(options.method, options.url, res.statusCode);
        if (err) {
          return reject(err);
        }
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (error) {
          resolve(body);
        }
      });
    });
  }

  function makeUrl(endpoint, config) {
    if (config.params) {
      endpoint = compile(endpoint, config.params);
    }

    let url = baseUrl + endpoint;
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
    return url;
  }

  function compile(template, data) {
    const result = template.replace(/{.+?}/g, function (matcher) {
      const path = matcher.slice(1, -1).trim();
      return _.get(data, path, "");
    });
    return result;
  }
};

module.exports = { APIFactory };
