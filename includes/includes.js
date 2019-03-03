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

const fs = require('fs');


const readFile = function(filename)
{
    return new Promise(function(resolve, reject)
    {
        try
        {
            resolve(fs.readFileSync(filename));
        }
        catch (e)
        {
            console.log(e);
            console.log("Could not find " + filename);
            return("");
        }
    })
};

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
        readFile(path).then(function(content)
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
        return module.exports.includeInObject(HEADER_KEY, templateContext, HEADER_FILE);
    },


    includeInObject: function(key, context, fileName)
    {
        return new Promise(function(resolve, reject)
        {
            readFile(fileName).then(function(result)
            {
                console.log(result);
                context[key] = result;
                resolve();
            }).catch(function(error)
            {
                context[key] = "File Not Found";
                reject(error);
                console.log(error);
            })
        });
    },


    /**
     * A function similar to the include statement in PHP
     * This function writes a file to the output
     *
     * @param fileName the file to append to the result
     */
    include: function(fileName)
    {
        return readFile(fileName);
    },

    /**
     * Appends the footer to the result object
     *
     * @return {*|Promise}
     */
    printFooter: function(templateContext)
    {
        return module.exports.includeInObject(FOOTER_KEY, templateContext, FOOTER_FILE);
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
    sendCSS: function(result, path)
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
        return readFile("templates/" + templateName);
    },


    /**Sends the user an image from the specified fileName.
     *
     * @param result
     * @param fileName
     */
    sendHTML: function(result, fileName)
    {
        readFile("." + fileName).then(function(content)
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