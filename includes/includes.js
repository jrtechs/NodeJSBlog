/**
 Includes.js
 File used for getting the header and footer
 */
const utils = require('../utils/utils.js');

const HEADER_FILE = "includes/header.html";

const FOOTER_FILE = "includes/footer.html";

const ADMIN_HEADER = "includes/adminHeader.html";

const crypto = require('crypto');

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


        var css = cache.get(path);

        if(css == null)
        {
            utils.include("./" + path).then(function(content)
            {
                var eTag = crypto.createHash('md5').update(content).digest('hex');
                result.writeHead(200, {'Content-Type': 'text/css', 'Cache-Control':
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
            var eTag = crypto.createHash('md5').update(css).digest('hex');
            result.writeHead(200, {'Content-Type': 'text/css', 'Cache-Control': 'public, max-age=2678400', 'ETag': '"' + eTag + '"', 'Vary': 'Accept-Encoding'});
            result.write(css);
            result.end();
        }
    }
};