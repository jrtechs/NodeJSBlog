/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 *
 * @author Jeffery Russell 7-21-18
 */

const http = require('http');

const url = require('url');

const express = require("express");

const session = require('express-session');

const includes = require('./includes/includes.js');

const app = express();

const utils = require('./utils/utils.js');

const port = 8001;

const cache = require('memory-cache');

/** Initializes sessions for login */
app.use(session({ secret: utils.getFileLine('../session_secret'), cookie: { maxAge: 6000000 }}));


/**
 * Parses the request url and calls correct JS files
 */
app.use(function(request, res)
{
    if(request.headers.host.includes("localhost:" + port) ||
        request.headers.host.includes("jrtechs.net"))
    {
        const filename = url.parse(request.url, true).pathname;

        //handles image requests
        if(filename.includes("/img/") || filename.includes(".jpg") || filename.includes(".png"))
        {
            require("./img/image.js").main(res, filename, cache);
        }
        else if(filename.includes("/css/") || filename.includes(".woff2"))
        {
            includes.sendCSS(res, filename, cache)
        }
        else if(filename.includes("/js/") || filename.includes(".js"))
        {
            require("./js/js.js").main(res, filename, cache);
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'text/html'});

            file = "./admin/admin.js";

            Promise.all([includes.printAdminHeader(),
                require(file).main(filename, request),
                includes.printFooter()]).then(function(content)
            {
                res.write(content.join(''));
                res.end();

            }).catch(function(err)
            {
                console.log(err);
                throw err;
            });
        }
    }
    else
    {
        // utils.printWrongHost(res);
        res.writeHead(418, {});
        res.end();
    }
});

http.createServer(app).listen(port);


