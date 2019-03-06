const routes = require('express').Router();

/** about page */
const about = require('./about');
routes.use('/about', about);

/** admin page and all of its sub pages */
const admin = require('./admin');
routes.use('/admin', admin);

/** Contact page */
const contact = require('./contact');
routes.use('/contact', contact);

/** Downloads path for files */
const downloads = require('./downloads');
routes.use('/downloads', downloads);

/** static content like css, js, and images */
const includes = require('./includes');
routes.use('/includes', includes);


/** category pages */
const category = require('./category');
routes.use('/category', category);



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