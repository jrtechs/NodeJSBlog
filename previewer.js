//http server
const http = require('http');

//used to parse the request URL
const url = require('url');

//express app
const express = require("express");

//express app
const app = express();

//used to append static content to result
const includes = require('./includes/includes.js');

//used to append static content to result
const contentLoader = require('./includes/staticContentServer.js');

//port for the server to run on
const port = 8000;

/**
 * Parses the request url and calls correct JS files
 */
app.use(function(request, result)
{

    const filename = url.parse(request.url, true).pathname;

    if(contentLoader.serveStaticContent(request, result, filename, ""))
    {
        //do nothing
    }
    else
    {
        result.writeHead(200, {'Content-Type': 'text/html'});
        Promise.all([includes.printHeader(),
            require('./utils/renderBlogPost.js').generateBlogPostComponent('/programming/', 'cs-theory-exam-2-review', -1),
            includes.printFooter()]).then(function (content)
        {
            result.write(content.join(''));
            result.end();

        }).catch(function (err)
        {
            console.log(err);
            throw err;
        });
    }

});



http.createServer(app).listen(port);


