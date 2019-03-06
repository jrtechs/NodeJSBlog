const routes = require('express').Router();

const builder = require('../../utils/pageBuilder');

routes.get('/', (request, result) =>
{
    builder.constructAdminPage(request, result, require("../../admin/adminDownloads").main)
});

routes.post('/', (request, result) =>
{
    builder.adminPostRoute(request ,require("../../admin/adminDownloads").processPostData).then(function()
    {
        result.redirect('/admin/downloads');
    })
});

module.exports = routes;