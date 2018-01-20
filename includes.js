/**
 Includes.js
 File used for getting the header and footer
 */
const utils = require('./utils.js');

const HEADER_FILE = "includes/header.html";

const FOOTER_FILE = "includes/footer.html";

module.exports =
{
    printHeader: function(res)
    {
        res.writeHead(200, {'Content-Type': 'text/html'});
        utils.include(res, HEADER_FILE);
        //res.write("Header<br>");
    },
    printFooter: function(res)
    {
        //res.write("footer");
        utils.include(res, FOOTER_FILE);
        res.end();
    }
};