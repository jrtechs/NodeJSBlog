const sql = require('../utils/sql');

const blogPostRenderer = require('./renderBlogPost.js');

module.exports=
    {
        /**
         * Renders the previews of recent blog blog and the side bar
         *
         * @param res
         * @param fileName request url
         */
        main: function(requestURL, request, templateContext)
        {
            var page = request.query.page;
            return new Promise(function(resolve, reject)
            {
                sql.getRecentPostSQL().then(function(posts)
                {
                    resolve(blogPostRenderer.renderBatchOfPosts(requestURL, posts, page, 5, templateContext));
                }).catch(function(error)
                {
                    reject(error);
                })
            });
        }
    };