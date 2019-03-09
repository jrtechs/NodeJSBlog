const routes = require('express').Router();

const builder = require('../../utils/pageBuilder');

routes.get('/', (request, result) =>
{
    builder.constructAdminPage(request, result, require("../../admin/analytics").main)
});

module.exports = routes;