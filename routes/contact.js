const routes = require('express').Router();

const utils = require('../utils/utils.js');

routes.get('/', (request, result) =>
{
    require("../blog/contact.js").main(request, result);
});

routes.get('*', (request, result) =>
{
    utils.print404(result);
});

module.exports = routes;