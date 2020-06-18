const routes = require('express').Router();
const sql = require('../../utils/sql');

const renderPost = require('../../blog/renderBlogPost');

routes.get('/posts', (request, result) =>
{
    sql.getAllPosts().then((data)=>
    {
        result.json(data).end();
    }).catch((err)=>
    {
        result.status(500).json([]).end();
    });
});


routes.get('/preview/:postID', (request, result) =>
{
    sql.getPostById(request.params.postID).then((sqlData)=>
    {
        renderPost.generateBlogPost(sqlData, 3).then((rendered)=>
        { 
            result.json(rendered).end();
        });
    }).catch((err)=>
    {
        result.status(404).json({error: 404}).end();
    })
});


routes.get('/render/:postID', (request, result) =>
{
    sql.getPostById(request.params.postID).then((sqlData)=>
    {
        renderPost.generateBlogPost(sqlData, -1).then((rendered)=>
        { 
            result.json(rendered).end();
        });
    }).catch((err)=>
    {
        result.status(404).json({error: 404}).end();
    })
});

routes.get('*', (request, result) =>
{
    result.json([]).end();
});

module.exports = routes;