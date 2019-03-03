const routes = require('express').Router();

const utils = require('../../utils/utils.js');

routes.get('/', (request, result) =>
{
    utils.constructAdminPage(request, result, require("../../admin/adminHome").main)
});


routes.post('/', (request, result) =>
{
    utils.constructAdminPage(request, result, require("../../admin/login").main)
});

module.exports = routes;