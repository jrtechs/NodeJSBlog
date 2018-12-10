const sql = require('../utils/sql');

const batchPreview = require('../posts/renderBatchOfPreviewes');

/**Renders each recent post for the homepage of the website
 *
 * @param result
 * @returns {*|Promise}
 */
var renderRecentPosts = function(baseURL, page)
{
    return new Promise(function(resolve, reject)
    {
        sql.getRecentPostSQL().then(function(posts)
        {
            resolve(batchPreview.main(baseURL, posts, page, 5));
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
            var page = request.query.page;
            return new Promise(function(resolve, reject)
            {
                Promise.all([renderRecentPosts(requestURL, page), require("../sidebar/sidebar.js").main()]).then(function(content)
                {
                    resolve(content.join(''));
                }).catch(function(error)
                {
                    reject(error);
                });
            })
        }
    };