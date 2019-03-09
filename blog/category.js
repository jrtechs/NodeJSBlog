/** DB query */
const sql = require('../utils/sql');

/** Object used to render blog post previews */
const blogBodyRenderer = require('./renderBlogPost');


module.exports=
    {
        /**
         * Calls blog and sidebar modules to render blog contents in order
         *
         * @param requestURL
         * @param request
         * @returns {Promise}
         */
        main: function(requestURL, request, templateContext)
        {
            console.log(requestURL);
            return new Promise(function(resolve, reject)
            {
                var page = request.query.page;

                const category = requestURL.split("/").join("");

                sql.getPostsFromCategory(category).then(function(posts)
                {
                    Promise.all([blogBodyRenderer.renderBatchOfPosts(requestURL, posts, page, 5, templateContext),
                        require('./renderNextBar').main("/category" + request.url, page, 5, posts.length, templateContext)]).then(function()
                    {
                        resolve();
                    });
                }).catch(function()
                {
                    delete templateContext["posts"];
                    reject();
                });

            });
        }
    };