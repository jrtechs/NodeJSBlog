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

//name of header file
const HEADER_FILE = "includes/header.html";

//path of footer file
const FOOTER_FILE = "includes/footer.html";

//admin header path
const ADMIN_HEADER = "includes/adminHeader.html";

//used for hashing stuff for the header's e-tag for clients cache
const crypto = require('crypto');


/**
 * Sends a static file to the client in a way which the web browser
 * caches the contents sent.
 *
 * @param cache -- server's hashmap which reduces file io
 * @param path -- file requested by user
 * @param type -- type of file for the header
 * @param result -- sent to client
 */
const sendCachedContent = function(cache, path, type, result)
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
            cache.put(path, content);
        }).catch(function(error)
        {
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
    printHeader: function()
    {
        return utils.include(HEADER_FILE);
    },


    /**
     * Appends the footer to the result object
     *
     * @return {*|Promise}
     */
    printFooter: function()
    {
        return utils.include(FOOTER_FILE);
    },

    /**
     * Displays the admin header
     *
     * @returns {*|Promise}
     */
    printAdminHeader()
    {
        return utils.include(ADMIN_HEADER);
    },


    /**Sends a css file to the user
     *
     * @param result
     * @param path
     * @return {*}
     */
    sendCSS: function(result, path, cache)
    {
        sendCachedContent(cache, "/" + path, 'text/css', result);
    },


    /**Sends the user an image from the specified fileName.
     *
     * @param result
     * @param fileName
     */
    sendImage: function(result, fileName, cache)
    {
        sendCachedContent(cache, fileName, 'image/png', result);
    },


    /**Sends the user an image from the specified fileName.
     *
     * @param result
     * @param fileName
     */
    sendJS: function(result, fileName, cache)
    {
        sendCachedContent(cache, fileName, 'application/javascript', result);
    }
};