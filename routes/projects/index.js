const routes = require('express').Router();

const url = require('url');

const contentLoader = require('../../includes/staticContentServer.js');

routes.get('*', (request, result) =>
{
    var filename = url.parse(request.url, true).pathname;
    var extra = '';
    if(filename === '/')
    {
        if(request.originalUrl.charAt(request.originalUrl.length -1) !== '/')
        {
            result.redirect(request.originalUrl + "/");
        }
        else
        {
            extra = "/index.html";
        }
    }

    if(!contentLoader.serveStaticContent(request, result,
        request.originalUrl + extra, "blogContent/projects"))
    {

    }
});

module.exports = routes;