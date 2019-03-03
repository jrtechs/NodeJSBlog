const routes = require('express').Router();

/** used to parse the request URL */
const url = require('url');

routes.get('/', (request, result) =>
{
    const filename = url.parse(request.url, true).pathname;
    require("../../includes/downloads.js").main(result, filename);
});


module.exports = routes;