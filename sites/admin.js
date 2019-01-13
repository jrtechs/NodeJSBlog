//sending static content
const includes = require('../includes/includes.js');

//used for file IO
const utils = require('../utils/utils.js');


//used to append static content to result
const contentLoader = require('../includes/staticContentServer.js');

const whiskers = require('whiskers');

/**
 * @author Jeffery Russell 11-3-18
 *
 * @type {{main: (function(*=, *): Promise)}}
 */
module.exports=
    {
        /**
         * Calls posts and sidebar modules to render blog contents in order
         *
         * @param requestURL
         * @returns {Promise|*}
         */
        main: function(request, result, filename)
        {
            if(contentLoader.serveStaticContent(request, result, filename, ""))
            {
                //do nothing
            }
            else
            {
                const clientAddress = (request.headers['x-forwarded-for'] || '').split(',')[0]
                    || request.connection.remoteAddress;


                result.writeHead(200, {'Content-Type': 'text/html'});

                const file = "../admin/admin.js";

                var templateContext = Object();
                Promise.all([includes.printAdminHeader(templateContext),
                    require(file).main(request, clientAddress, templateContext),
                    includes.printFooter(templateContext),
                    includes.fetchTemplate("admin/adminMain.html")]).then(function(content)
                {

                    result.write(whiskers.render(content.join(''), templateContext));
                    result.end();

                }).catch(function(err)
                {
                    console.log(err);
                    throw err;
                });
            }
        }
    };