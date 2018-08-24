//DB query
const sql = require('../utils/sql');

//file IO
const utils = require('../utils/utils.js');


/**
 * Renders all posts in a single category
 *
 * @param resultURL
 * @returns {*}
 */
const renderPosts = function(resultURL)
{
    const splitURL = resultURL.split("/");
    if(splitURL.length >= 3)
    {
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
                            .renderPreview(p).then(function(html)
                        {
                            res(html);
                        }).catch(function(error)
                        {
                            rej(error);
                        })
                    }));
                });

                Promise.all(promises).then(function(content)
                {
                    resolve("<div class='col-md-8'>" + content.join('') + "</div>");
                }).catch(function(error)
                {
                    reject(error);
                });
            }).catch(function(err)
            {
                reject(err);
            })
        });
    }
    else
    {
        return utils.print404();
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
        main: function(requestURL, request)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([renderPosts(requestURL),
                    require("../sidebar/sidebar.js").main()]).then(function(content)
                {
                    resolve(content.join(''));
                }).catch(function(err)
                {
                    reject(err);
                })
            });
        }
    };