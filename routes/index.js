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
routes.use('/blogContent', includes);
routes.use('/sitemap.txt', includes);
routes.use('/robots.txt', includes);


const photosPages = require('./photos');
routes.use('/photos', photosPages);

/** category pages */
const category = require('./category');
routes.use('/category', category);

const pageBuilder = require('../utils/pageBuilder');

const project = require('./projects');
routes.use('/steam', project);



//blog home page
routes.get('/', (request, result) =>
{
    pageBuilder.buildBlogPage(request, result, require("../blog/homePage").main)
});

//regular blog posts
routes.get('*', (request, result) =>
{
    pageBuilder.buildBlogPage(request, result,
        require("../blog/posts").main, request.url);
});

module.exports = routes;