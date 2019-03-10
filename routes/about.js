const routes = require('express').Router();

const pageBuilder = require('../utils/pageBuilder');

routes.get('/', (request, result) =>
{
    pageBuilder.buildPageWithTemplate(request, result,
        (p1,p2,p3)=>{}, "blog/about.html");
});


routes.get('*', (request, result) =>
{
    pageBuilder.print404(result);
});

module.exports = routes;