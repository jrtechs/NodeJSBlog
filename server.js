/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 */

const http = require('http');

const url = require('url');

const includes = require('./includes/includes.js');

http.createServer(function (request, res)
{
    var q = url.parse(request.url, true);
    var filename = q.pathname;

    //handles image requests
    if(filename.includes("/img/"))
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

        var urlSplit = filename.split("/");

        console.log(urlSplit);

        if(urlSplit.length >= 2 && urlSplit[1] === 'category') //single category page
            file = "./posts/category.js";

        else if(urlSplit.length >= 2 && urlSplit[1] === 'admin') //top secret admin page
            file = "./admin/admin.js";

        else if(urlSplit.length >= 3)//single post page
            file = "./posts/posts.js";

        else //single static page?
            file = "./posts/pages.js";

        console.log(file);

        includes.printHeader(res).then(function()
        {
            return require(file).main(res, filename, request);
        }).then(function()
        {
            return includes.printFooter(res);
        }).then(function()
        {
            console.log("fin"); //for debugging
        })
    }

}).listen(8080);