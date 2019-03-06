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

const builder = require('../../utils/pageBuilder.js');

routes.get('/', (request, result) =>
{
    builder.constructAdminPage(request, result, require("../../admin/adminHome").main)
});

routes.post('/', (request, result) =>
{
    builder.adminPostRoute(request, require("../../admin/adminHome").processPostData).then(function()
    {
        result.redirect("/admin");
    });
});

routes.get('*', (request, result) =>
{
    builder.print404(result);
});

module.exports = routes;