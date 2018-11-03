//used to append static content to result
const includes = require('../includes/includes.js');

//used to append static content to result
const contentLoader = require('../includes/staticContentServer.js');


//caching program to make the application run faster
const cache = require('memory-cache');

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
            //downloads
            else if (filename.includes("/downloads/"))
            {
                require("../includes/downloads.js").main(result, filename);
            }
            else if (filename.includes("/contact"))
            {
                require("../includes/contact.js").main(request, result);
            }
            else
            {
                const html = cache.get(filename);

                result.writeHead(200, {'Content-Type': 'text/html'});
                if (html == null) {
                    var file = "";

                    if (filename === '' || filename === '/')
                    {
                        file = "../posts/homePage.js";
                    }
                    else
                    {
                        var urlSplit = filename.split("/");

                        if (urlSplit.length >= 2 && urlSplit[1] === 'category') //single category page
                            file = "../posts/category.js";

                        else
                            file = "../posts/posts.js";
                    }

                    Promise.all([includes.printHeader(),
                        require(file).main(filename, request),
                        includes.printFooter()]).then(function (content)
                    {
                        result.write(content.join(''));
                        result.end();
                        cache.put(filename, content.join(''));

                    }).catch(function (err)
                    {
                        console.log(err);
                        throw err;
                    });
                }
                else
                {
                    result.write(html);
                    result.end();
                }
            }
        }
    };