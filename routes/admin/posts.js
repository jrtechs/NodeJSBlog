const routes = require('express').Router();

const utils = require('../../utils/utils.js');

routes.get('/', (request, result) =>
{
    utils.constructAdminPage(request, result, require("../../admin/posts").main)
});

routes.post('/', (request, result) =>
{
    utils.adminPostPageWithOutput(request, result ,require("../../admin/posts").processPostData)
});

module.exports = routes;