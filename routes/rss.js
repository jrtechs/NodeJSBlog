var RSS = require('rss');

const routes = require('express').Router();

const pageBuilder = require('../utils/pageBuilder');

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


// var xml = require('xml');
var xmlFeed = feed.xml();

const sql = require('../utils/sql');

sql.getRecentPosts().then((data)=>
{
    for(var i = 0; i < data.length; i++)
    {
        feed.item({
            title: data[i].name,
            url: "https://jrtechs.net/" + data[i].category + "/" + data[i].url,
            date: data[i].published
        });
    }
    xmlFeed = feed.xml();
}).catch((err)=>
{
    console.log(err);
});




routes.get('/', (request, result) =>
{
    result.set('Content-Type', 'text/xml');
    result.send(xmlFeed);
});

routes.get('*', (request, result) =>
{
    pageBuilder.print404(result);
});

module.exports = routes;