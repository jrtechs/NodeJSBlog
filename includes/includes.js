/**
 * File: Includes.js
 *
 * Module used for fetching static content for the website
 * like js, css, images, and other static html pages
 *
 * @author Jeffery Russell
 */

//used for file IO
const utils = require('../utils/utils.js');

const HEADER_KEY = "header";

const FOOTER_KEY = "footer";

//name of header file
const HEADER_FILE = "includes/html/header.html";

//path of footer file
const FOOTER_FILE = "includes/html/footer.html";

//admin header path
const ADMIN_HEADER = "includes/html/adminHeader.html";

//used for hashing stuff for the header's e-tag for clients cache
const crypto = require('crypto');


//caching program to make the application run faster
const cache = require('memory-cache');


/**
 * Sends a static file to the client in a way which the web browser
 * caches the contents sent.
 *
 * @param cache -- server's hashmap which reduces file io
 * @param path -- file requested by user
 * @param type -- type of file for the header
 * @param result -- sent to client
 */
const sendCachedContent = function(path, type, result)
{
    const goods = cache.get(path);

    if(goods == null)
    {
        utils.include("." + path).then(function(content)
        {
            const eTag = crypto.createHash('md5').update(content).digest('hex');
            result.writeHead(200, {'Content-Type': type, 'Cache-Control':
                    'public, max-age=2678400', 'ETag': '"' + eTag + '"',
                    'Vary': 'Accept-Encoding'});
            result.write(content);
            result.end();
        }).catch(function(error)
        {
            cache.del(path);
            console.log(error);
        });
    }
    else
    {
        const eTag = crypto.createHash('md5').update(goods).digest('hex');
        result.writeHead(200, {'Content-Type': type,
            'Cache-Control': 'public, max-age=2678400',
            'ETag': '"' + eTag + '"',
            'Vary': 'Accept-Encoding'});
        result.write(goods);
        result.end();
    }
};


module.exports =
{
    /** Appends the header html section to the result which is
     * sent to the user.
     *
     * @param result
     * @return {*} a promise retrieved from the utils.include function
     */
    printHeader: function(templateContext)
    {
        return utils.includeInObject(HEADER_KEY, templateContext, HEADER_FILE);
    },


    /**
     * Appends the footer to the result object
     *
     * @return {*|Promise}
     */
    printFooter: function(templateContext)
    {
        return utils.includeInObject(FOOTER_KEY, templateContext, FOOTER_FILE);
    },

    /**
     * Displays the admin header
     *
     * @returns {*|Promise}
     */
    printAdminHeader(templateContext)
    {
        return utils.includeInObject(HEADER_KEY, templateContext, ADMIN_HEADER);
    },


    /**Sends a css file to the user
     *
     * @param result
     * @param path
     * @return {*}
     */
    sendCSS: function(result, path, cache)
    {
        sendCachedContent(path, 'text/css', result);
    },


    /**Sends the user an image from the specified fileName.
     *
     * @param result
     * @param fileName
     */
    sendImage: function(result, fileName)
    {
        sendCachedContent(fileName, 'image/png', result);
    },


    /**Sends the user an image from the specified fileName.
     *
     * @param result
     * @param fileName
     */
    sendJS: function(result, fileName)
    {
        sendCachedContent(fileName, 'application/javascript', result);
    },


    fetchTemplate: function(templateName)
    {
        return utils.include("templates/" + templateName);
    },


    /**Sends the user an image from the specified fileName.
     *
     * @param result
     * @param fileName
     */
    sendHTML: function(result, fileName)
    {
        utils.include("." + fileName).then(function(content)
        {
            result.writeHead(200, {'Content-Type': 'text/html'});
            result.write(content);
            result.end();
        }).catch(function(error)
        {
            console.log(error);
        });
    },


    /**
     * Sends a svg file to the client.
     *
     * @param result
     * @param fileName
     */
    sendSVG: function(result, fileName)
    {
        sendCachedContent(fileName, 'image/svg+xml', result);
    },

    /**
     * Clears the cache
     */
    clearCache: function()
    {
        console.log("Includes cache cleared");
        cache.clear();
    }
};