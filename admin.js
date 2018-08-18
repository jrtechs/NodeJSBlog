/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 *
 * @author Jeffery Russell 7-21-18
 */

//http server
const http = require('http');

//parsing request url
const url = require('url');

//express app
const express = require("express");
const app = express();

//session data for login
const session = require('express-session');

//sending static content
const includes = require('./includes/includes.js');

//used for file io
const utils = require('./utils/utils.js');

//cache -- only used for static contents
const cache = require('memory-cache');

/** Initializes sessions for login */
app.use(session({ secret: utils.getFileLine('../session_secret'), cookie: { maxAge: 6000000 }}));

//port to listen for the admin server on
const port = 8001;


/**
 * Parses the request url and calls correct JS files
 */
app.use(function(request, result)
{
    //prevents people from pointing their dns at my IP:port for my site
    if(request.headers.host.includes("localhost:" + port) ||
        request.headers.host.includes("jrtechs.net"))
    {
        const filename = url.parse(request.url, true).pathname;

        //handles image requests
        if(filename.includes("/img/") || filename.includes(".jpg") || filename.includes(".png"))
        {
            includes.sendJS(result, filename, cache);
        }
        else if(filename.includes("/css/") || filename.includes(".woff2"))
        {
            includes.sendCSS(result, filename, cache)
        }
        else if(filename.includes("/js/") || filename.includes(".js"))
        {
            includes.sendJS(result, filename, cache);
        }
        else
        {
            result.writeHead(200, {'Content-Type': 'text/html'});

            const file = "./admin/admin.js";

            Promise.all([includes.printAdminHeader(),
                require(file).main(filename, request),
                includes.printFooter()]).then(function(content)
            {
                result.write(content.join(''));
                result.end();

            }).catch(function(err)
            {
                console.log(err);
                throw err;
            });
        }
    }
    else
    {
        // utils.printWrongHost(result);
        result.writeHead(418, {});
        result.end();
    }
});

http.createServer(app).listen(port);