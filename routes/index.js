const routes = require('express').Router();

const about = require('./about');
routes.use('/about', about);

const contact = require('./contact');
routes.use('/contact', contact);

const projects = ["/steam/"];


routes.get('/', (request, result) =>
{
    //blog home
});


routes.get('*', (request, result) =>
{
    //error
});


module.exports = routes;