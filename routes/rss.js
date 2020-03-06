var RSS = require('rss');

const routes = require('express').Router();

const pageBuilder = require('../utils/pageBuilder');

const sql = require('../utils/sql');


const generateRSSfeed = function()
{

    var feed = new RSS({
        title: 'jrtechs',
        description: 'Jeffery\'s blog which has everything from data-science to cooking',
        feed_url: 'https://jrtechs.net/rss',
        site_url: 'https://jrtechs.net',
        image_url: 'https://jrtechs.net/includes/img/favicon/android-chrome-512x512.png',
        docs: 'https://github.com/jrtechs/NodeJSBlog',
        managingEditor: 'Jeffery Russell',
        webMaster: 'Jeffery Russell',
        copyright: 'Jeffery Russell',
        language: 'en',
        categories: ['other', 'hardware', 'open-source', 'programming', 'projects', 'web-development', 'data-science'],
    });

    return new Promise((resolve, reject)=>
    {
        sql.getRecentPosts(limit=200).then((data)=>
        {
            for(var i = 0; i < data.length; i++)
            {
                feed.item({
                    title: data[i].name,
                    url: "https://jrtechs.net/" + data[i].category + "/" + data[i].url,
                    date: data[i].published
                });
            }
            resolve(feed.xml());
        }).catch((err)=>
        {
            console.log(err);
        });
    })
}


routes.get('/', (request, result) =>
{
    result.set('Content-Type', 'text/xml');
    generateRSSfeed().then((data)=>
    {
        result.send(data);
    }).catch((err)=>
    {
        pageBuilder.print404(result);
    })
});

routes.get('*', (request, result) =>
{
    pageBuilder.print404(result);
});

module.exports = routes;