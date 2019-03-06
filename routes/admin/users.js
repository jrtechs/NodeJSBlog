const routes = require('express').Router();

const builder = require('../../utils/pageBuilder.js');

routes.get('/', (request, result) =>
{
    builder.constructAdminPage(request, result, require("../../admin/users").main)
});

routes.post('/', (request, result) =>
{
    builder.adminPostPageWithOutput(request, result ,require("../../admin/users").processPostData)
});

module.exports = routes;