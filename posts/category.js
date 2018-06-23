var Promise = require('promise');
const sql = require('../utils/sql');
const utils = require('../utils/utils.js');


/**
 * Renders all posts in a single category
 *
 * @param result
 * @param resultURL
 * @returns {*}
 */
var renderPosts = function(result, resultURL)
{
    var splitURL = resultURL.split("/");
    if(splitURL.length >= 3)
    {
        result.write("<div class='col-md-8'>");

        return new Promise(function(resolve, reject)
        {
            sql.getPostsFromCategory(splitURL[2]).then(function(posts)
            {
                var promises = [];
                posts.forEach(function(p)
                {
                    promises.push(new Promise(function(res, rej)
                    {
                        require("../posts/singlePost.js")
                            .renderPreview(result, p).then(function()
                        {
                            res();
                        });
                    }));
                });
                return Promise.all(promises);
            }).then(function()
            {
                result.write("</div>");
                resolve();
            }).catch(function(err)
            {
                console.log(err);
            })
        });
    }
    else
    {
        return utils.print404(result);
    }
};

module.exports=
    {
        /**
         * Calls posts and sidebar modules to render blog contents in order
         *
         * @param res
         * @param fileName request url
         */
        main: function(res, requestURL, request)
        {
            return new Promise(function(resolve, reject)
            {
                renderPosts(res, requestURL).then(function()
                {
                    return require("../sidebar/sidebar.js").main(res)
                }).then(function ()
                {
                    resolve();
                }).catch(function(error)
                {
                    console.log(error);
                    reject(error);
                })
            });
        }
    }