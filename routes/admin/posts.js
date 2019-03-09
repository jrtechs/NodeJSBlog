const routes = require('express').Router();

const builder = require('../../utils/pageBuilder');

routes.get('/', (request, result) =>
{
    builder.constructAdminPage(request, result, require("../../admin/posts").main)
});

routes.post('/', (request, result) =>
{
    builder.adminPostPageWithOutput(request, result ,require("../../admin/posts").processPostData)
});

module.exports = routes;