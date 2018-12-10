//used to parse the request URL
const url = require('url');


//used to append static content to result
const contentLoader = require('../includes/staticContentServer.js');


/**
 * @author Jeffery Russell 10-30-18
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
        main: function(request, result, baseURL)
        {
            var filename = url.parse(request.url, true).pathname;


            if(filename == baseURL || filename == baseURL.substring(0, baseURL.length - 1))
            {
                filename = baseURL + "index.html";
            }


            if (!contentLoader.serveStaticContent(request, result, filename, "/blogContent/projects"))
            {
                //do something?
            }
        }
    };