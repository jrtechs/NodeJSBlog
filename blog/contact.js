/**
 * Handler for contact page
 * @author Jeffery Russell 8-19-18
 */

/** used for file IO */
const utils = require('../utils/utils.js');

/** used for static files */
const includes = require('../includes/includes');

const TEMPLATE_FILE = "blog/contact.html";
const whiskers = require('whiskers');


module.exports =
    {
        /**
         * Displays the contact page along with the header, sidebar, and footer.
         * This uses the admin header because it doesn't need any minified css
         * which has been purged of some css classes which are not used in any
         * of the blog blog.
         *
         * @param request -- main express request
         * @param result -- renders the html of the contact page
         */
        main: function(request, result)
        {
            result.writeHead(200, {'Content-Type': 'text/html'});

            var templateContext = Object();
            Promise.all([includes.fetchTemplate(TEMPLATE_FILE),
                includes.printHeader(templateContext),
                includes.printFooter(templateContext),
                require("./sidebar.js").main(templateContext)])
                .then(function (content)
            {
                const html = whiskers.render(content[0], templateContext);
                result.write(html);
                result.end();
            }).catch(function(err)
            {
                console.log(err);
            });
        }
    };
