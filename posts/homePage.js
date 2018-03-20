const sql = require('../utils/sql');

const utils = require('../utils/utils.js');

const Promise = require('promise');

const postRenderer = require('../posts/singlePost.js');


var renderRecentPosts = function(result)
{
    return new Promise(function(resolve, reject)
    {
        sql.getRecentPostSQL().then(function(posts)
        {
            var postPromises = [];
            result.write("<div class='w3-col l8 s12'>");
            posts.forEach(function(post)
            {
                postPromises.push(new Promise(function(res, rej)
                {
                    postRenderer.renderPreview(result, post).then(function()
                    {
                        res();
                    }).catch(function(error)
                    {
                        rej(error);
                    })
                }));
            });

            Promise.all(postPromises).then(function()
            {
                result.write("</div>");
                resolve();
            }).catch(function(error)
            {
                reject(error);
            })
        }).catch(function(error)
        {
            console.log(error);
            reject(error);
        })
    });
};

module.exports=
    {
        /**
         * Renders the previews of recent blog posts and the side bar
         *
         * @param res
         * @param fileName request url
         */
        main: function(result, requestURL, request)
        {
            return new Promise(function(resolve, reject)
            {
                renderRecentPosts(result).then(function()
                {
                    return require("../sidebar/sidebar.js").main(result);
                }).then(function()
                {
                    resolve();
                }).catch(function(error)
                {
                    console.log(error);
                    reject(error);
                })
            })
        }
    };