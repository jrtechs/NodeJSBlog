const routes = require('express').Router();

const utils = require('../../utils/utils.js');

routes.get('/', (request, result) =>
{
    utils.constructAdminPage(request, result, require("../../admin/analytics").main)
});

module.exports = routes;