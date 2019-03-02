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

routes.get('/', (request, result) =>
{
    if(utils.checkPrivilege(request) >= utils.PRIVILEGE.MEMBER)
    {
        utils.renderHTML(request, result, "users.html", getUserInformation);
    }
    else
    {
        utils.printError(result, "You need to be logged in");
    }
});

routes.get('*', (request, result) =>
{
    //error
});

module.exports = routes;