const routes = require('express').Router();

const utils = require('../../utils/utils.js');

routes.get('/', (request, result) =>
{
    utils.constructAdminPage(request, result, require("../../admin/adminDownloads").main)
});

routes.post('/', (request, result) =>
{
    utils.adminPostRoute(request ,require("../../admin/adminDownloads").processPostData).then(function()
    {
        result.redirect('/admin/downloads');
    })
});

module.exports = routes;