var Promise = require('promise');
const sql = require('../utils/sql');
const utils = require('../utils/utils.js');



var renderPosts = function(result, resultURL)
{
    var splitURL = resultURL.split("/");
    if(splitURL.length >= 3)
    {
        result.write("<div class=\"w3-col l8 s12\">\n");

        return new Promise(function(resolve, reject)
        {
            sql.getPostsFromCategory(splitURL[2]).then(function(posts)
            {
                var promises = [];
                console.log(posts);
                console.log("^^^^");
                posts.forEach(function(p)
                {
                    promises.push(new Promise(function(res, rej)
                    {
                        require("../posts/singlePost.js")
                            .renderPost(result, p)
                            .then(function()
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
        renderPostPreview: function(result, postSQLData)
        {

        },

        /**
         * Calls posts and sidebar modules to render blog contents in order
         *
         * @param res
         * @param fileName request url
         */
        main: function(res, requestURL, request)
        {
            console.log("category page");
            return new Promise(function(resolve, reject)
            {
                renderPosts(res, requestURL).then(function()
                {
                    return require("../sidebar/sidebar.js").main(res)
                }).then(function ()
                {
                    resolve();
                })
            });
        }
    }