const routes = require('express').Router();

const pageBuilder = require('../../utils/pageBuilder');

const utils = require('../../utils/utils');

const whiskers = require('whiskers');

const url = require('url');

routes.get('/', (request, result) =>
{
    //do something later
    console.log("boo");
});

routes.get('*', (request, result) =>
{
    pageBuilder.buildPageWithTemplate(request, result,
        function(){}, "photos/photosEntry.html");
});

module.exports = routes;