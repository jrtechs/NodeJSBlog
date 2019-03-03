const routes = require('express').Router();

const about = require('./about');
routes.use('/about', about);

const contact = require('./contact');
routes.use('/contact', contact);

const downloads = require('./downloads');
routes.use('/downloads', downloads);

const includes = require('./includes');
routes.use('/includes', includes);

const projects = ["/steam/"];




routes.get('/', (request, result) =>
{
    //blog home page
});


routes.get('*', (request, result) =>
{
    console.log("Un registered event.")
});


module.exports = routes;