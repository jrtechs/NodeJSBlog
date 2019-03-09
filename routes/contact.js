const routes = require('express').Router();

const pageBuilder = require('../utils/pageBuilder');

routes.get('/', (request, result) =>
{
    require("../blog/contact.js").main(request, result);
});

routes.post('/', (request, result) =>
{
    require("../blog/contact.js").main(request, result);
});

routes.get('*', (request, result) =>
{
    pageBuilder.print404(result);
});

module.exports = routes;