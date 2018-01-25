/**
 Includes.js
 File used for getting the header and footer
 */
const utils = require('../utils/utils.js');

const HEADER_FILE = "includes/header.html";

const FOOTER_FILE = "includes/footer.html";

const Promise = require('promise');

module.exports =
{
    /** Appends the header html section to the result which is
     * sent to the user.
     *
     * @param result
     * @return {*} a promise retrieved from the utils.include function
     */
    printHeader: function(result)
    {
        result.writeHead(200, {'Content-Type': 'text/html'});
        return utils.include(result, HEADER_FILE);
    },
    /**
     * Appends the footer to the result object
     *
     * @param result
     * @return {*|Promise}
     */
    printFooter: function(result)
    {
        return new Promise(function(resolve, reject)
        {
            console.log(FOOTER_FILE);
            utils.include(result, FOOTER_FILE).then(function()
            {
                result.end();
                resolve();
            })

        })
    },

    /**Sends a css file to the user
     *
     * @param result
     * @param path
     * @return {*}
     */
    sendCSS: function(result, path)
    {
        result.writeHead(200, {'Content-Type': 'text/css'});
        utils.include(result, "./" + path);
        result.end();
    }
};