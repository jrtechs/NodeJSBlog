/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 */

const http = require('http');

const url = require('url');

const express = require("express");

const session = require('express-session');

const includes = require('./includes/includes.js');

const utils = require('./utils/utils.js');

const map = require('./utils/generateSiteMap.js');
map.main();

const app = express();

app.use(session({ secret: utils.getFileLine('../session_secret'), cookie: { maxAge: 6000000 }}));

const port = 8000;

const cache = require('memory-cache');


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
        else if(filename.includes("/css/") || filename.includes(".txt"))
        {
            includes.sendCSS(res, filename, cache)
        }
        else if(filename.includes("/downloads/"))
        {
            require("./downloads/downloads.js").main(res, filename, request);
        }
        else
        {
            var file = "";

            var html = cache.get(filename);

            res.writeHead(200, {'Content-Type': 'text/html'});
            if(html == null)
            {
                if(filename === '' || filename === '/')
                {
                    file="./posts/homePage.js";
                }
                else
                {
                    var urlSplit = filename.split("/");

                    if(urlSplit.length >= 2 && urlSplit[1] === 'category') //single category page
                        file = "./posts/category.js";

                    else if(urlSplit.length >= 2 && urlSplit[1] === 'admin') //top secret admin page
                        file = "./admin/admin.js";

                    else
                        file = "./posts/posts.js";
                }

                Promise.all([includes.printHeader(),
                    require(file).main(filename, request),
                    includes.printFooter()]).then(function(content)
                {
                    res.write(content.join(''));
                    res.end();
                    cache.put(filename, content.join(''));

                }).catch(function(err)
                {
                    console.log(err);
                    throw err;
                });
            }
            else
            {
                res.write(html);
                res.end();
            }
        }
    }
    else
    {
        utils.printWrongHost(res);
        res.end();
    }
});

http.createServer(app).listen(port);
