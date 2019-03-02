//used to append static content to result
const includes = require('../includes/includes.js');

//used to append static content to result
const contentLoader = require('../includes/staticContentServer.js');

const whiskers = require('whiskers');

const TEMPLATE_FILE="blog/blogMain.html";


const PAGINATION_TEMPLATE_KEY = "paginationTemplate";
const PAGINATION_TEMPLATE_FILE = "blog/paginationBar.html";


//caching program to make the application run faster
const cache = require('memory-cache');

//file io
const utils = require('../utils/utils.js');

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
                require("../blog/contact.js").main(request, result);
            }
            else
            {
                var page = request.query.page;
                if(typeof page == "undefined")
                    page = 1;
                page = Number(page);

                const html = cache.get(filename + "?page=" + page);

                result.writeHead(200, {'Content-Type': 'text/html'});
                if (html == null)
                {
                    var file = "";

                    if (filename === '' || filename === '/')
                    {
                        file = "../blog/homePage.js";
                    }
                    else
                    {
                        var urlSplit = filename.split("/");

                        if (urlSplit.length >= 2 && urlSplit[1] === 'category') //single category page
                            file = "../blog/category.js";
                        else
                        {
                            file = "../blog/posts.js";
                            page = 1; // all blog are single page, everyone must be one to ensure
                            // cache is not tricked into storing same blog post a ton of times
                        }
                    }

                    var templateContext = Object();
                    Promise.all([includes.fetchTemplate(TEMPLATE_FILE),
                        utils.includeInObject(PAGINATION_TEMPLATE_KEY, templateContext, "templates/" + PAGINATION_TEMPLATE_FILE),
                        includes.printHeader(templateContext),
                        includes.printFooter(templateContext),
                        require(file).main(filename, request, templateContext),
                        require("../blog/sidebar.js").main(templateContext)])
                            .then(function (content)
                    {
                        var html = whiskers.render(content[0], templateContext);
                        result.write(html);
                        result.end();
                        cache.put(filename + "?page=" + page, html);
                    }).catch(function (err)
                    {
                        console.log(err);
                        cache.del(filename + "?page=" + page);
                        utils.print404().then(function(content)
                        {
                            result.write(content);
                            result.end();
                        })
                    });
                }
                else
                {
                    result.write(html);
                    result.end();
                }
            }
        },

        /**
         * Clears the memory cache.
         */
        clearCache: function()
        {
            console.log("Blog cache cleared");
            cache.clear();
        }
    };