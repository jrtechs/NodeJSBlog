//file io
const utils = require('../../utils/utils.js');

//update db
const sql = require('../../utils/sql');

//parse post data
const qs = require('querystring');


/**
 * Displays all the categories in the database
 * @return {*|Promise}
 */
const printCategories = function()
{
    var html = "<div class=\"blogPost\">" +
        "<h1 class=\"text-center\">Categories</h1>" +
        "<div class=\"\"><table class=\"table table-striped\">" +
        "<thead class=\"thead-dark\">" +
        "<tr>" +
        "<td>Name</td><td>URL</td><td>Edit</td>" +
        "</tr></thead><tbody>";

    return new Promise(function(resolve, reject)
    {
        sql.getCategories().then(function(categories)
        {
            categories.forEach(function(c)
            {
                html +="<tr>" +
                    "<td>" + c.name + "</td>" +
                    "<td>" + c.url + "</td>" +
                    "<td>" + c.category_id + "</td>" +
                    "</tr>";
            });
            resolve(html + "</tbody></table></div></div>");
        }).catch(function(error)
        {
            reject(error);
        })
    });
};


/**
 * Checks for post data regarding adding a new category.
 * If a post is made with add_category, it parses the url-- replaces spaces
 * with dashes -- and calls a insert method on the database
 *
 * @param postData
 * @return {*|Promise}
 */
const processPost = function(postData)
{
    return new Promise(function(resolve, reject)
    {
        const post = qs.parse(postData);
        if(post.add_category)
        {
            const url = post.add_category.split(" ").join("-").toLowerCase();
            const q = "insert into categories (name, url) values " +
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
        resolve("");
    });
};


module.exports=
{
    main: function(postData)
    {
        return new Promise(function(resolve, reject)
        {
            Promise.all([utils.include("./admin/category/addCategory.html"),
                printCategories(),
                processPost(postData)]).then(function(html)
            {
                resolve("<div class=\"col-md-6\">" +
                    html.join('') +
                    "</div></div>");
            }).catch(function(error)
            {
                console.log("error in addCategory.js");
                reject(error);
            })
        });
    }
};