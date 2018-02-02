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

var app = express();

// var https = require('https');


//var key = fs.readFileSync('private.key');
//var cert = fs.readFileSync( 'primary.crt' );
//var ca = fs.readFileSync( 'encryption/intermediate.crt' );

// var options = {
//     key: key,
//     cert: cert,
//     ca: ca
// };

app.use(session({ secret: utils.getFileContents('../../session_secret'), cookie: { maxAge: 6000000 }}));

app.use(function(request, res)
{
    var q = url.parse(request.url, true);
    var filename = q.pathname;

    //handles image requests
    if(filename.includes("/img/") || filename.includes(".jpg"))
    {
        require("./img/image.js").main(res, filename);
    }
    else if(filename.includes("/css/"))
    {
        includes.sendCSS(res, filename)
    }
    else
    {
        var file = "";

        if(filename === '' || filename === '/')
            filename = '/category/projects';

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
        }).then(function()
        {
            //console.log("fin"); //for debugging
        })
    }
});

//https.createServer(options, app).listen(443);

http.createServer(app).listen(8080);

//app.use(forceSsl);