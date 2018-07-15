const sql = require('../utils/sql');

const utils = require('../utils/utils.js');

const Promise = require('promise');

const postRenderer = require('../posts/singlePost.js');

/**Renders each recent post for the homepage of the website
 *
 * @param result
 * @returns {*|Promise}
 */
var renderRecentPosts = function()
{
    return new Promise(function(resolve, reject)
    {
        console.log("recent post render page");
        sql.getRecentPostSQL().then(function(posts)
        {
            var postPromises = [];
            var content = "<div class='col-md-8'>";
            posts.forEach(function(post)
            {
                postPromises.push(new Promise(function(res, rej)
                {
                    postRenderer.renderPreview(post).then(function(cont)
                    {
                        res(cont);
                    }).catch(function(error)
                    {
                        rej(error);
                    })
                }));
            });

            Promise.all(postPromises).then(function(cont)
            {
                content = content + cont.join('') + "</div>";
                resolve(content);
            }).catch(function(error)
            {
                reject(error);
            })
        }).catch(function(error)
        {
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
        main: function(requestURL, request)
        {
            return new Promise(function(resolve, reject)
            {
                // renderRecentPosts().then(function()
                // {
                //     return require("../sidebar/sidebar.js").main();
                // }).then(function()
                // {
                //     resolve();
                // }).catch(function(error)
                // {
                //     console.log(error);
                //     reject(error);
                // })


                console.log("home page");
                Promise.all([renderRecentPosts(), require("../sidebar/sidebar.js").main()]).then(function(content)
                {
                    console.log("fin posts");
                    resolve(content.join(''));
                }).catch(function(error)
                {
                    reject(error);
                });
            })
        }
    };