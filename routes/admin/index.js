const routes = require('express').Router();

const analytics = require('./analytics');
routes.use('/analytics', analytics);

const login = require('./login');
routes.use('/login', login);

const posts = require('./posts');
routes.use('/posts', posts);

const downloads = require('./downloads');
routes.use('/downloads', downloads);

const users = require('./users');
routes.use('/users', users);

const utils = require('../../utils/utils.js');

routes.get('/', (request, result) =>
{
    utils.constructAdminPage(request, result, require("../../admin/adminHome").main)
});

routes.post('/', (request, result) =>
{
    utils.constructAdminPage(request, result, require("../../admin/adminHome").processPostData);
});

routes.get('*', (request, result) =>
{
    utils.print404(result);
});

module.exports = routes;