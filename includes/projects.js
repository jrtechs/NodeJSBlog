//file io
const utils = require('../utils/utils.js');

//used to parse the request URL
const url = require('url');


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
            //const filename = url.parse(request.url, true).pathname

            var filename = url.parse(request.url, true).pathname;

            if(filename.includes(".svg") || filename.includes(".svg"))
            {
                result.writeHead(200, {'Content-Type': 'image/svg+xml'});
            }
            else if(filename.includes("/img/") || filename.includes(".jpg") ||
                filename.includes(".png") || filename.includes(".ico"))
            {
                result.writeHead(200, {'Content-Type': 'image/png'});
            }
            else if(filename.includes("/css/") || filename.includes(".woff2") ||
                filename.includes(".txt"))
            {
                result.writeHead(200, {'Content-Type': 'text/css'});
            }
            else if(filename.includes("/js/") || filename.includes(".js"))
            {
                result.writeHead(200, {'Content-Type': 'application/javascript'});
            }
            else
            {
                result.writeHead(200, {'Content-Type': 'text/html'});
            }

            if(filename == baseURL || filename == baseURL.substring(0, baseURL.length - 1))
            {
                filename = baseURL + "index.html";
            }

            utils.include("./blogContent/projects" + filename).then(function(content)
            {
                result.write(content);
                result.end();
            }).catch(function(error)
            {
                console.log(error);
            });
        }
    };