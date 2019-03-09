const routes = require('express').Router();

/** used to parse the request URL */
const url = require('url');

const contentLoader = require('../../includes/staticContentServer.js');



routes.get('*', (request, result) =>
{
    var filename = url.parse(request.url, true).pathname;
    console.log(request.originalURL);
    console.log(request.url.path);
    if(!contentLoader.serveStaticContent(request, result, request.originalUrl, ""))
    {



        //missing content
    }
});


module.exports = routes;