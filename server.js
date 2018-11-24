/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 */

// Stores the configuration for the server
const config = require('./utils/configLoader').getConfig();

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

//used for file io
const utils = require('./utils/utils.js');

//Updates the site map whenever the server is started
const map = require('./utils/generateSiteMap.js');
map.main();


//session data for login
const session = require('express-session');

//Initializes sessions for login
app.use(session({ secret: config.SESSION_SECRET, cookie: { maxAge: 6000000 }}));


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

        var project = false;
        projects.forEach(function(projectName)
        {
            if(filename.startsWith(projectName))
            {
                require("./sites/projects.js").main(request, result, projectName);
                project = true;
            }
        });

        if(filename.startsWith("/admin"))
        {
            require("./sites/admin.js").main(request, result, filename);
            project = true;
        }

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


http.createServer(app).listen(config.PORT);