const routes = require('express').Router();

const pageBuilder = require('../../utils/pageBuilder');

routes.get('*', (request, result) =>
{
    pageBuilder.buildBlogPage(request, result, require("../../blog/category").main)
});

module.exports = routes;