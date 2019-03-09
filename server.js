/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 */

/** Stores the configuration for the server */
const config = require('./utils/configLoader').getConfig();

/** Port for the server to run on */
const port = config.PORT;

/** express app */
const express = require("express");

/** express app */
const app = express();

/** Used for gzip compression */
const compression = require('compression');

/**Updates the site map whenever the server is started */
const map = require('./utils/generateSiteMap.js');
map.main();


/**session data for login */
const session = require('express-session');

/**Initializes sessions for login */
app.use(session({ secret: config.SESSION_SECRET, cookie: { maxAge: 6000000 }}));

const routes = require('./routes');
app.use('/', routes);

//enables gzip compression for the site
app.use(compression());


app.listen(port, () =>
    console.log(`App listening on port ${port}!`)
);