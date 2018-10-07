const postGenerator = require('../utils/renderBlogPost.js');


module.exports=
{
    /**
     * Renders a preview of the post with a link to view more
     *
     * @param res
     * @param post
     */
    renderPreview: function(post)
    {
        return postGenerator.generateBlogPost(post, 3);
    },

    /**
     * renderPost() displays a single blog post in it's entirety
     *
     * @param res result sent to user
     * @param post sql data about the blog post
     * @return {*|Promise}
     */
    renderPost: function(post)
    {
        return postGenerator.generateBlogPost(post, -1);
    }
};