const utils = require('../utils/utils.js');
const sql = require('../utils/sql');
var Promise = require('promise');

var renderSideBar = function(res, requestURL)
{
    return new Promise(function(resolve, reject)
    {
        require("../includes/sidebar.js").main(res, requestURL).then(function()
        {
            resolve();
        })
    });
};

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
                console.log("a " + post);
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
     * Function which parses a url and displays appropriate post
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
                return renderSideBar(res, requestURL);
            }).then(function ()
            {
                resolve();
            });
        });
    }
};