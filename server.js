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

//server side logging
const sql = require('./utils/sql');

//Used for gzip compression
const compression = require('compression');



//Updates the site map whenever the server is started
const map = require('./utils/generateSiteMap.js');
map.main();


//port for the server to run on
const port = 8000;

const projects = ["/steam/"];

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

        console.log("main main" + filename)
        var project = false;
        projects.forEach(function(projectName)
        {
            if(filename.startsWith(projectName))
            {
                require("./sites/projects.js").main(request, result, projectName);
                project = true;
            }
        });
        if(!project)
        {
            require("./sites/blog.js").main(request, result, filename);
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


