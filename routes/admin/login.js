const routes = require('express').Router();

const builder = require('../../utils/pageBuilder.js');

routes.get('/', (request, result) =>
{
    builder.constructAdminPage(request, result, require("../../admin/adminHome").main)
});


routes.post('/', (request, result) =>
{
    builder.constructAdminPage(request, result, require("../../admin/login").main)
});

module.exports = routes;