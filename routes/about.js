const routes = require('express').Router();

routes.get('/', (request, result) =>
{

});


routes.get('*', (request, result) =>
{
    //error
});

module.exports = routes;