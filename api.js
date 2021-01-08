const request = require("request");
const _ = require("lodash");

const APIFactory = ({ baseUrl, apiKey, secretKey }) => {
  const credentials = Buffer.from(apiKey + ":" + secretKey).toString("base64");

  const API = {
    get: async (endpoint, config) => {
      return await call(endpoint, "GET", config);
    },

    post: async (endpoint, data, config) => {
      return await call(endpoint, "POST", config, data);
    },
  };

  return API;

  function call(endpoint, method, config = {}, data) {
    return new Promise((resolve, reject) => {
      const url = makeUrl(endpoint, config);
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
        if (err) {
          return reject(err);
        }
        try {
          resolve(result);
        } catch (error) {
          reject(error);
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
