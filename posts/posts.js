const utils = require('../utils/utils.js');
const sql = require('../utils/sql');
var Promise = require('promise');


/**
 * Function responsible for calling the appropriate sql requests to query
 * database and serve correct blog post
 *
 * @param res the result sent to the client
 * @param requestURL url requested from client
 * @return {*|Promise} returns a resolved promise to preserve execution order
 */
var renderPost = function(res, requestURL)
{
    return new Promise(function(resolve, reject)
    {
        res.write("<div class=\"w3-col l8 s12\">");
        var splitURL = requestURL.split("/");

        //user entered /category/name/ or /category/name
        if(splitURL.length == 3 || splitURL.length == 4)
        {
            sql.getPost(requestURL).then(function(post)
            {
                if(post != 0)
                {
                    return require("../posts/singlePost.js").renderPost(res, post);
                }
                else
                {
                    return utils.include(res, "includes/404.html");
                }
            }).then(function()
            {
                res.write("</div>");
                resolve();
            })
        }
        else
        {
            console.log("error in parameters");
        }
    });
};

module.exports=
{
    /**
     * Calls posts and sidebar modules to render blog contents in order
     *
     * @param res
     * @param fileName request url
     */
    main: function(res, requestURL, request)
    {
        return new Promise(function(resolve, reject)
        {
            renderPost(res, requestURL).then(function()
            {
                return require("../sidebar/sidebar.js").main(res)
            }).then(function ()
            {
                resolve();
            });
        });
    }
};