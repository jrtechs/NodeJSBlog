const routes = require('express').Router();

const utils = require('../utils/utils');

const whiskers = require('whiskers');

const url = require('url');

routes.get('/', (request, result) =>
{
    //do something later
});

routes.get('*', (request, result) =>
{
    console.log("ding");
});

module.exports = routes;