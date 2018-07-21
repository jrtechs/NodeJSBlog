const utils = require('../utils/utils.js');
const sql = require('../utils/sql');
const Promise = require('promise');


/**
 * Function responsible for calling the appropriate sql requests to query
 * database and serve correct blog post
 *
 * @param res the result sent to the client
 * @param requestURL url requested from client
 * @return {*|Promise} returns a resolved promise to preserve execution order
 */
const renderPost = function(requestURL)
{
    return new Promise(function(resolve, reject)
    {
        var splitURL = requestURL.split("/");

        //user entered /category/name/ or /category/name
        if(splitURL.length == 3 || splitURL.length == 4)
        {
            sql.getPost(requestURL).then(function(post)
            {
                if(post != 0)
                {
                    return require("../posts/singlePost.js").renderPost(post);
                }
                else
                {
                    return utils.print404();
                }
            }).then(function(html)
            {
                resolve("<div class='col-md-8'>" + html + "</div>");
            }).catch(function(error)
            {
                reject(error);
            })
        }
        else
        {
            utils.print404().then(function(html)
            {
               resolve("<div class='col-md-8'>" + html + "</div>");
            });
        }
    });
};

module.exports=
{
    /**
     * Calls posts and sidebar modules to render blog contents in order
     *
     * @param requestURL
     * @returns {Promise|*}
     */
    main: function(requestURL, request)
    {
        return new Promise(function(resolve, reject)
        {
            Promise.all([renderPost(requestURL), require("../sidebar/sidebar.js").main()]).then(function(content)
            {
                resolve(content.join(''));
            }).catch(function(error)
            {
                reject(error);
            })
        });
    }
};