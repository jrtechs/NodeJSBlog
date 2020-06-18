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
            templateContext["categoryID"] = 0;
            return new Promise(function(resolve, reject)
            {
                sql.getAllPosts().then(function(posts)
                {
                    Promise.all([blogPostRenderer.renderBatchOfPosts(requestURL, posts, page, 5, templateContext),
                        require('./renderNextBar').main(requestURL, page, 5, posts.length, templateContext)]).then(function()
                    {
                        resolve();
                    });
                }).catch(function(error)
                {
                    reject(error);
                })
            });
        }
    };