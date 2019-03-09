const routes = require('express').Router();

const contentLoader = require('../../includes/staticContentServer.js');

routes.get('*', (request, result) =>
{
    if(!contentLoader.serveStaticContent(request, result, request.originalUrl, ""))
    {

        //missing content
    }
});


module.exports = routes;