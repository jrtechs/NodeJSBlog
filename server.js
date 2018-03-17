/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 */

const http = require('http');

const url = require('url');

var express = require("express");

var session = require('express-session');

const includes = require('./includes/includes.js');
//
const utils = require('./utils/utils.js');
//
// var forceSsl = require('express-force-ssl');

var map = require('./utils/generateSiteMap');
map.main();

var app = express();

app.use(session({ secret: utils.getFileLine('../session_secret'), cookie: { maxAge: 6000000 }}));

app.use(function(request, res)
{
    var q = url.parse(request.url, true);
    var filename = q.pathname;

    //handles image requests
    if(filename.includes("/img/") || filename.includes(".jpg") || filename.includes(".png"))
    {
        require("./img/image.js").main(res, filename);
    }
    else if(filename.includes("/css/") || filename.includes(".txt"))
    {
        includes.sendCSS(res, filename)
    }
    // else if(filename.includes(/download/))
    // {
    //     require("./downloads/downloads.js").main(res, filename, request);
    // }
    else
    {
        var file = "";

        if(filename === '' || filename === '/')
            filename = '/programming/using-english-conventions-to-write-clean-code/';

        var urlSplit = filename.split("/");

        if(urlSplit.length >= 2 && urlSplit[1] === 'category') //single category page
            file = "./posts/category.js";

        else if(urlSplit.length >= 2 && urlSplit[1] === 'admin') //top secret admin page
            file = "./admin/admin.js";

        else
            file = "./posts/posts.js";


        includes.printHeader(res).then(function()
        {
            return require(file).main(res, filename, request);
        }).then(function()
        {
            return includes.printFooter(res);
        }).catch(function(err)
        {
            console.log(err);
        })
    }
});

//https.createServer(options, app).listen(443);

http.createServer(app).listen(8080);

//app.use(forceSsl);