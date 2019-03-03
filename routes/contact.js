const routes = require('express').Router();

routes.get('/', (request, result) =>
{
    require("../blog/contact.js").main(request, result);
});

routes.get('*', (request, result) =>
{
    //error
});

module.exports = routes;