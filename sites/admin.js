//sending static content
const includes = require('../includes/includes.js');


//used to append static content to result
const contentLoader = require('../includes/staticContentServer.js');

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
                result.writeHead(200, {'Content-Type': 'text/html'});

                const file = "../admin/admin.js";

                Promise.all([includes.printAdminHeader(),
                    require(file).main(request),
                    includes.printFooter()]).then(function(content)
                {
                    result.write(content.join(''));
                    result.end();

                }).catch(function(err)
                {
                    console.log(err);
                    throw err;
                });
            }

        }
    };