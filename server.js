var http = require('http');
const url = require('url');
const fs = require('fs');
const utils = require('./utils.js');
const includes = require('./includes.js');

http.createServer(function (req, res)
{
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;

    //prints header
    includes.printHeader(res);

    utils.include(res, "README.md");

    if(filename.includes("/category"))
    {
        console.log("categories");
        test();
    }
    else if(filename.includes("/posts/"))
    {
        console.log("posts");
    }
    else if(filename.includes("/downloads/"))
    {
        console.log("downloads");
    }
    else
    {
        console.log("default");
    }
    includes.printFooter(res);
}).listen(8080);