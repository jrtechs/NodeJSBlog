const routes = require('express').Router();
const sql = require('../../utils/sql');



routes.get('/posts', (request, result) =>
{
    sql.getAllPosts().then((data)=>
    {
        result.json(data).end();result
    }).catch((err)=>
    {
        result.status(500).json([]).end();
    });
});

routes.get('*', (request, result) =>
{
    result.json([]).end();
});

module.exports = routes;