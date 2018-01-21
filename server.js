/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 */

const http = require('http');

const url = require('url');

const includes = require('./includes/includes.js');

http.createServer(function (request_url, res)
{
    var q = url.parse(request_url.url, true);
    var filename = q.pathname;
    console.log(filename.split("/"));
    console.log(filename);
    //prints header




    //handles image requests
    if(filename.includes("/img/"))
    {
        require("./img/image.js").main(res, filename);
    }
    else
    {
        includes.printHeader(res);

        //categories or view a category page
        if(filename.includes("/category"))
            require("../posts/category.js").main(res, filename);
        //downloads page
        else if(filename.includes("/downloads/"))
        {}


        //admin page
        else if(filename.includes("/admin"))
            require("./admin/admin.js").main(res, filename);


        //normal blog entry
        else
            require("./posts/posts.js").main(res, filename);


        //includes footer file
        includes.printFooter(res);
    }





}).listen(8080);