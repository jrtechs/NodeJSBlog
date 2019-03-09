const routes = require('express').Router();

const pageBuilder = require('../utils/pageBuilder');

routes.get('/', (request, result) =>
{

});


routes.get('*', (request, result) =>
{
    pageBuilder.print404(result);
});

module.exports = routes;