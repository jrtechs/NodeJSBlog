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


    /**Sends a css file to the user
     *
     * @param result
     * @param path
     * @return {*}
     */
    sendCSS: function(result, path)
    {
        result.writeHead(200, {'Content-Type': 'text/css'});
        utils.include("./" + path).then(function(content)
        {
            result.write(content);
            result.end();
        }).catch(function(error)
        {
            console.log(error);
        });

    }
};