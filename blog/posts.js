/** DB queries */
const sql = require('../utils/sql');

/** Object used to render blog post previews */
const blogBodyRenderer = require('./renderBlogPost');

module.exports=
{
    /**
     * Calls blog and sidebar modules to render blog contents in order
     *
     * @param requestURL
     * @returns {Promise|*}
     */
    main: function(requestURL, request, templateContext)
    {
        return new Promise(function(resolve, reject)
        {
            const splitURL = requestURL.split("/");

            //user entered /category/name/ or /category/name
            if(splitURL.length == 3 || splitURL.length == 4)
            {
                sql.getPost(requestURL).then(function(posts)
                {
                    if(posts.length != 0)
                    {
                        blogBodyRenderer.renderBatchOfPosts(requestURL, posts, 1, 1, templateContext).then(function()
                        {
                            resolve();
                        });
                    }
                    else
                    {
                        resolve();
                    }

                })
            }
            else
            {
                //404 will print
                resolve();
            }
        });
    }
};