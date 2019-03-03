const routes = require('express').Router();

/** used to parse the request URL */
const url = require('url');

const contentLoader = require('../../includes/staticContentServer.js');



routes.get('*', (request, result) =>
{
    var filename = url.parse(request.url, true).pathname;

    if(!contentLoader.serveStaticContent(request, result, filename, "includes"))
    {
        //missing content
    }
});


module.exports = routes;