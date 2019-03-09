const routes = require('express').Router();

const utils = require('../utils/utils.js');

routes.get('/', (request, result) =>
{

});


routes.get('*', (request, result) =>
{
    utils.print404(result);
});

module.exports = routes;