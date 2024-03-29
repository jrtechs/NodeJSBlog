const utils = require('./utils');

const whiskers = require('whiskers');

const includes = require("../includes/includes");

const cache = require('memory-cache');


const CACHE_ENABLED = utils.getConfig()['CACHE'];

const ADMIN_CHECK = utils.getConfig()["ADMIN_CHECK"];

/** used to parse the request URL */
const url = require('url');


const TEMPLATE_FILE="blog/blogMain.html";

const HEADER_TEMPLATE_FILE="blog/header.html";
const HEADER_TEMPLATE_KEY="header";


const PAGINATION_TEMPLATE_KEY = "paginationTemplate";
const PAGINATION_TEMPLATE_FILE = "blog/paginationBar.html";



module.exports =
    {
        /**
         * Displays 404 error to user
         *
         * @param result
         * @returns {*}
         */
        print404: function(result)
        {
            includes.include("includes/html/404.html").then(function(html)
            {
                result.write(html);
                result.end();
            })
        },


        constructAdminPage: function(request, result, templateFiller)
        {
            var templateContext = Object();
            var promises = [];

            promises.push(includes.fetchTemplate("admin/adminMain.html"));
            promises.push(includes.printAdminHeader(templateContext));
            promises.push(includes.printFooter(templateContext));

            if(module.exports.loggedIn(request))
            {
                templateContext.loggedIn = true;
                promises.push(templateFiller(templateContext));
            }
            else
            {
                //login
                const clientAddress = (request.headers['x-forwarded-for'] || '').split(',')[0]
                    || request.connection.remoteAddress;
                promises.push(require("../admin/login").main(request, clientAddress,templateContext));
            }

            Promise.all(promises).then(function(content)
            {
                result.write(whiskers.render(content[0], templateContext));
                result.end();
            }).catch(function(err)
            {
                console.log(err);
                throw err;
            });
        },

        adminPostPageWithOutput: function(request, result, templateFiller)
        {
            utils.getPostData(request).then(function(postData)
            {
                var templateContext = Object();
                var promises = [];

                promises.push(includes.fetchTemplate("admin/adminMain.html"));
                promises.push(includes.printAdminHeader(templateContext));
                promises.push(includes.printFooter(templateContext));

                if (module.exports.loggedIn(request))
                {
                    templateContext.loggedIn = true;
                    promises.push(templateFiller(templateContext, postData));
                }
                else
                {
                    //login
                    const clientAddress = (request.headers['x-forwarded-for'] || '').split(',')[0]
                        || request.connection.remoteAddress;
                    promises.push(require("../admin/login").main(request, clientAddress, templateContext));
                }

                Promise.all(promises).then(function (content)
                {
                    result.write(whiskers.render(content[0], templateContext));
                    result.end();
                }).catch(function (err) {
                    console.log(err);
                    throw err;
                });
            });
        },


        adminPostRoute: function(request, templateFiller)
        {
            return new Promise(function(resolve, reject)
            {
                utils.getPostData(request).then(function(postData)
                {
                    templateFiller(postData).then(function()
                    {
                        resolve();
                    })
                }).catch(function(e)
                {
                    reject(e);
                })
            })
        },


        loggedIn(request)
        {
            return(ADMIN_CHECK == false || (request.session && request.session.user));
        },


        buildBlogPageWithURL: function(request, result, templateFiller, filename)
        {
            var page = request.query.page;
            if(typeof page == "undefined")
                page = 1;
            page = Number(page);

            const html = CACHE_ENABLED == true ? cache.get(filename + "?page=" + page) : null;

            result.writeHead(200, {'Content-Type': 'text/html'});
            if (html == null)
            {
                var templateContext = Object();
                Promise.all([includes.fetchTemplate(TEMPLATE_FILE),
                    includes.includeInObject(PAGINATION_TEMPLATE_KEY, templateContext, "templates/" + PAGINATION_TEMPLATE_FILE),
                    includes.includeInObject(HEADER_TEMPLATE_KEY, templateContext, "templates/" + HEADER_TEMPLATE_FILE),
                    includes.printFooter(templateContext),
                    templateFiller(filename, request, templateContext),
                    require("../blog/sidebar.js").main(templateContext)])
                    .then(function (content)
                    {
                        const html = whiskers.render(content[0], templateContext);
                        result.write(html);
                        result.end();
                        if(CACHE_ENABLED == true)
                        {
                            cache.put(filename + "?page=" + page, html);
                        }
                    }).catch(function (err)
                {
                    cache.del(filename + "?page=" + page);

                    module.exports.print404(result)
                });
            }
            else
            {
                result.write(html);
                result.end();
            }
        },

        buildBlogPage: function(request, result, templateFiller)
        {
            var filename = url.parse(request.url, true).pathname;
            module.exports.buildBlogPageWithURL(request, result,templateFiller, filename);
        },

        /**
         * Clears the memory cache.
         */
        clearCache: function()
        {
            console.log("Blog cache cleared");
            cache.clear();
        },


        buildPageWithTemplate: function(request, result, templateFiller, templateFile)
        {
            var templateContext = Object();
            Promise.all([includes.include("templates/" + templateFile),
                includes.printHeader(templateContext),
                templateFiller(request.url, request, templateContext),
                includes.printFooter(templateContext),
                require("../blog/sidebar.js").main(templateContext)])
                    .then(function (content)
                    {
                        const html = whiskers.render(content[0], templateContext);
                        result.write(html);
                        result.end();
                    })
        }
    };