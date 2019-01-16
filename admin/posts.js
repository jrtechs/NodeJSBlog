/** Whiskers template file
 * this has stuff for both editing blog and viewing a list of blog*/
const TEMPLATE_FILE = "admin/adminPosts.html";

const includes = require('../includes/includes.js');

const sql = require('../utils/sql');

//parses the post data
const qs = require('querystring');


/**
 * Detects if the post data came from the edit form in blog table or edit post
 * in the edit post form.
 *
 * @param postData
 * @param renderContext
 * @returns {Promise}
 */
const processPostData = function(postData, renderContext)
{
    return new Promise(function(resolve, reject)
    {
        var postParsed = qs.parse(postData);

        if(postParsed.edit_post)
        {
            renderContext.editPost = true;
            sql.getPostById(postParsed.edit_post).then(function(post)
            {
                post.published = post.published.toISOString().split('T')[0];
                renderContext.post = post;
                resolve();
            });
        }
        else if(postParsed.edit_post_2)
        {
            sql.editPost(postParsed).then(function()
            {
                resolve();
            }).catch(function(error)
            {
                reject(error);
            });
        }
        else
        {
            resolve();
        }
    });
};


/**
 * Grabs and appends the list of blog from the SQL database to
 * the template context for the template renderer.
 *
 * @param templateContext
 * @returns {Promise}
 */
const fetchPostsInformation = function(templateContext)
{
    return new Promise(function(resolve, reject)
    {
        sql.getAllPosts().then(function(posts)
        {
            templateContext.posts = posts;
            resolve();
        }).catch(function(error)
        {
            reject(error);
        })
    });
};

module.exports=
    {
        /**
         * Fetches context information for the admin blog page and handles post
         * data sent regarding editing blog.
         *
         * @param postData posted by user
         * @param templateContext json object used as the template context
         * @returns {Promise} renders the template used for this page
         */
        main: function(postData, templateContext)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([includes.fetchTemplate(TEMPLATE_FILE),
                    processPostData(postData, templateContext),
                    fetchPostsInformation(templateContext)]).then(function(template)
                {
                    resolve(template[0]);
                }).catch(function(error)
                {
                    console.log("error in add admin blog.js");
                    reject(error);
                });
            });
        }
    };