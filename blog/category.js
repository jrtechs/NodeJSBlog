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
            return new Promise(function(resolve, reject)
            {
                var page = request.query.page;

                const splitURL = requestURL.split("/");
                if(splitURL.length >= 3)
                {

                    sql.getPostsFromCategory(splitURL[2]).then(function(posts)
                    {
                        blogBodyRenderer.renderBatchOfPosts(requestURL, posts, page, 5, templateContext).then(function()
                        {
                            resolve();
                        });
                    }).catch(function()
                    {
                        delete templateContext["posts"];
                        resolve();
                    });
                }

                else
                {
                    //page is not found but, posts list will be empty
                    // so 404 will display
                    resolve();
                }
            });
        }
    };