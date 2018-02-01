const utils = require('../utils/utils.js');
const sql = require('../utils/sql');

const qs = require('querystring');
var Promise = require('promise');


/**
 * Displays all the categories in the database
 * @param res
 * @return {*|Promise}
 */
var printCategories = function(res)
{
    res.write("<h1 class=\"w3-text-teal w3-center\">Categories</h1>");
    res.write("<div class=\"w3-responsive w3-card-4\"><table class=\"w3-table w3-striped w3-bordered\"><thead>");
    res.write("<tr class=\"w3-teal\">");
    res.write("<td>Name</td><td>URL</td><td>Edit</td>");
    res.write("</tr></thead><tbody>");
    return new Promise(function(resolve, reject)
    {
        sql.getCategories().then(function(categories)
        {
            categories.forEach(function(c)
            {
                res.write("<tr>");

                res.write("<td>" + c.name + "</td>");

                res.write("<td>" + c.url + "</td>");

                res.write("<td>" + c.category_id + "</td>");

                res.write("</tr>");
            });
            res.write("</tbody></table></div>");
            console.log("resolved");
            resolve();
        })
    });
};

/**
 * Checks for post data regarding adding a new category.
 * If a post is made with add_category, it parses the url-- replaces spaces
 * with dashes -- and calls a insert method on the database
 *
 * @param res
 * @param postData
 * @return {*|Promise}
 */
var processPost = function(res, postData)
{
    return new Promise(function(resolve, reject)
    {
        var post = qs.parse(postData);
        if(post.add_category)
        {
            var url = post.add_category.replace(/ /i, "-");
            url = url.toLowerCase();
            var q = "insert into categories (name, url) values " +
                "('" + post.add_category + "','" + url + "')";
            if(sql.insert(q) != 0)
            {
                console.log("category added");
            }
            else
            {
                console.log("error adding category");
            }

        }
        resolve(postData);
    });
};

module.exports=
{
    main: function(res, postData)
    {
        res.write("<div class=\"w3-third w3-container\">");
        return new Promise(function(resolve, reject)
        {
            utils.include(res, "./admin/addCategory.html");
            printCategories(res).then(function()
            {
                //console.write("categories finished");
                return processPost(res, postData);
            }).then(function()
            {

                res.write("</div>");
                resolve();
            }).catch(function(err)
            {
                console.log(err);
            })
        });
    }
};