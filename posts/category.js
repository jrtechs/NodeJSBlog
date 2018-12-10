//DB query
const sql = require('../utils/sql');

//file IO
const utils = require('../utils/utils.js');

const batchPreview = require('../posts/renderBatchOfPreviewes');


/**
 * Renders all posts in a single category
 *
 * @param resultURL
 * @returns {*}
 */
const renderPosts = function(resultURL, page)
{
    const splitURL = resultURL.split("/");
    if(splitURL.length >= 3)
    {
        return new Promise(function(resolve, reject)
        {
            sql.getPostsFromCategory(splitURL[2]).then(function(posts)
            {
                resolve(batchPreview.main(resultURL, posts, page, 5));
            }).catch(function(error)
            {
                reject(error);
            })
        });
    }
    else
    {
        reject("Page Not Found");
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
                var page = request.query.page;
                Promise.all([renderPosts(requestURL, page),
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