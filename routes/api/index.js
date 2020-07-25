const routes = require('express').Router();
const sql = require('../../utils/sql');

const renderPost = require('../../blog/renderBlogPost');


routes.get('/getPostsIds/:category', (request, result) =>
{
    if(request.params.category.length !== 1 && 
        request.params.category.length !== 2)
    {
        result.json("boo").end();
        return;
    }
    sql.getPostIds(request.params.category).then((sqlData)=>
    {
        var arr = [];
        for(var i = 5; i < sqlData.length; i++)
        {
            arr.push(sqlData[i].post_id)
        }
        result.json(arr).end();
    }).catch((err)=>
    {
        result.status(404).json({error: 404}).end();
    })
});

function getURL(sqlData)
{
    return "https://jrtechs.net/" + sqlData.category + "/" +  sqlData.url;
}


/**
 * Returns an svg containing the recent blog posts
 * 
 * Used on github profile readme:
 * https://github.com/jrtechs
 */
routes.get('/recentSVG', (request, result) =>
{
    sql.getRecentPosts(4).then((sqlData)=>
    {  
        result.writeHead(200, {'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache',
            'Vary': 'Accept-Encoding'});
        var res = `
        <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g>
                <title>background</title>
                <rect x="-1" y="-1" width="808" height="202" id="canvas_background" fill="#fff"/>
                    <g id="canvasGrid" display="none">
                <rect id="svg_1" width="100%" height="100%" x="0" y="0" stroke-width="0" fill="url(#gridpattern)"/>
                </g>
            </g>
            <g>
                <title>Jrtechs</title>
                <a xlink:href="https://jrtechs.net">
                    <text fill="#498FBE" stroke="#000" stroke-width="0" stroke-opacity="null" x="36.5" y="40.5" id="svg_6" font-size="24" font-family="Oswald, sans-serif" text-anchor="start" xml:space="preserve" font-weight="bold">Recent Blog Posts</text>
                </a>
                <a xlink:href="${getURL(sqlData[0])}">
                    <text fill="#000000" stroke="#000" stroke-width="0" stroke-opacity="null" x="65.5" y="73.5" id="svg_7" font-size="20" font-family="Oswald, sans-serif" text-anchor="start" xml:space="preserve" font-weight="normal">- ${sqlData[0].name}</text>
                </a>
                <a xlink:href="${getURL(sqlData[1])}">  
                    <text fill="#000000" stroke="#000" stroke-width="0" stroke-opacity="null" x="65.5" y="106.5" id="svg_7" font-size="20" font-family="Oswald, sans-serif" text-anchor="start" xml:space="preserve" font-weight="normal">- ${sqlData[1].name}</text>
                </a>
                <a xlink:href="${getURL(sqlData[2])}">
                    <text fill="#000000" stroke="#000" stroke-width="0" stroke-opacity="null" x="65.5" y="139.5" id="svg_7" font-size="20" font-family="Oswald, sans-serif" text-anchor="start" xml:space="preserve" font-weight="normal">- ${sqlData[2].name}</text>
                </a>
                <a xlink:href="${getURL(sqlData[3])}">   
                    <text fill="#000000" stroke="#000" stroke-width="0" stroke-opacity="null" x="65.5" y="172.5" id="svg_7" font-size="20" font-family="Oswald, sans-serif" text-anchor="start" xml:space="preserve" font-weight="normal">- ${sqlData[3].name}</text>
                </a>
            </g>
        </svg>`;
        result.write(res);
        result.end();
    }).catch((err)=>
    {
        result.status(404).json({error: 404}).end();
    })
});


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