/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 */

const http = require('http');

const url = require('url');
const includes = require('./includes/includes.js');

http.createServer(function (req, res)
{
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;

    //prints header
    includes.printHeader(res);

    if(filename.includes("/category"))
    {
        //categories or view a category page
    }
    else if(filename.includes("/downloads/"))
    {
        //downloads page
        //probably will be implemented later
    }
    else if(filename.includes("/admin"))
    {
        //admin page
    }
    else
    {
        //normal blog entry
    }

    //includes footer file
    includes.printFooter(res);

}).listen(8080);