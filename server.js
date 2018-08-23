/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 */

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

//server side logging
const sql = require('./utils/sql');

//Used for gzip compression
const compression = require('compression')

//caching program to make the application run faster
const cache = require('memory-cache');

//Updates the site map whenever the server is started
const map = require('./utils/generateSiteMap.js');
map.main();


//port for the server to run on
const port = 8000;


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
        if(filename.includes("/img/") || filename.includes(".jpg") ||
            filename.includes(".png") || filename.includes(".ico"))
        {
            includes.sendImage(result, filename, cache);
        }
        //css and font files
        else if(filename.includes("/css/") || filename.includes(".woff2") ||
            filename.includes(".txt"))
        {
            includes.sendCSS(result, filename, cache);
        }
        //scripts
        else if(filename.includes("/js/") || filename.includes(".js"))
        {
            includes.sendJS(result, filename, cache);
        }
        //downloads
        else if(filename.includes("/downloads/"))
        {
            require("./downloads/downloads.js").main(result, filename);
        }
        else if(filename.includes("/contact"))
        {
            require("./includes/contact.js").main(request, result);
        }
        else
        {
            const html = cache.get(filename);

            result.writeHead(200, {'Content-Type': 'text/html'});
            if(html == null)
            {
                var file = "";

                if(filename === '' || filename === '/')
                {
                    file="./posts/homePage.js";
                }
                else
                {
                    var urlSplit = filename.split("/");

                    if(urlSplit.length >= 2 && urlSplit[1] === 'category') //single category page
                        file = "./posts/category.js";

                    else
                        file = "./posts/posts.js";
                }

                Promise.all([includes.printHeader(),
                    require(file).main(filename, request),
                    includes.printFooter()]).then(function(content)
                {
                    result.write(content.join(''));
                    result.end();
                    cache.put(filename, content.join(''));

                }).catch(function(err)
                {
                    console.log(err);
                    throw err;
                });
            }
            else
            {
                result.write(html);
                result.end();
            }

            try
            {
                const getClientAddress = (request.headers['x-forwarded-for'] || '').split(',')[0]
                    || request.connection.remoteAddress;
                console.log(getClientAddress);

                sql.logTraffic(getClientAddress, filename);
            }
            catch (e)
            { }
        }
    }
    else
    {
        // utils.printWrongHost(result);
        result.writeHead(418, {});
        result.end();
    }
});


//enables gzip compression for the site
app.use(compression());


http.createServer(app).listen(port);


