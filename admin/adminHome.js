
const TEMPLATE_FILE = "admin/adminHome.html";

const includes = require('../includes/includes.js');

const sql = require('../utils/sql');

const qs = require('querystring');


/**
 * Checks for post data regarding adding a new category.
 * If a post is made with add_category, it parses the url-- replaces spaces
 * with dashes -- and calls a insert method on the database
 *
 * @param postData
 * @return {*|Promise}
 */
const processPostAddCategory = function(postData)
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
                resolve();
            }
            else
            {
                reject();
                console.log("error adding category");
            }
        }
        else
        {
            resolve();
        }

    });
};

/**
 * Displays all the categories in the database
 * @return {*|Promise}
 */
const appendCategoriesToTemplate = function(templateContext)
{
    return new Promise(function(resolve, reject)
    {
        sql.getCategories().then(function(categories)
        {
            templateContext.categories = categories;
            resolve();
        }).catch(function(error)
        {
            reject(error);
        })
    });
};

/**
 *
 * @param postData
 * @return {*|Promise}
 */
const processPost = function(postData)
{
    return new Promise(function(resolve, reject)
    {
        var post = qs.parse(postData);
        if(post.add_post_name)
        {
            var urls = post.add_post_name;
            urls = urls.split(" ").join("-");
            urls =urls.toLowerCase();

            var q = "insert into posts (category_id, picture_url, published, name, url)  values ";

            q += "('" + post.add_post_category + "', '" +  post.add_post_picture +
                "', '" + post.add_post_date + "', '" + post.add_post_name + "', '" + urls + "')";
            sql.insert(q).then(function()
            {
                var map = require('../utils/generateSiteMap');
                map.main();
                resolve();
            }).catch(function(error)
            {
                reject(error);
            })
        }
        else if(post.clear_cache)
        {
            require("../sites/blog.js").clearCache();
            require("../includes/includes.js").clearCache();
            resolve();
        }
        else if(post.git_pull)
        {
            const execSync = require('child_process').execSync;
            code = execSync('git pull');
            resolve();
        }
        else
        {
            resolve();
        }
    });
};



module.exports=
    {
        /**
         *
         * @param postData posted by user
         * @param templateContext json object used as the template context
         * @returns {Promise} renders the template used for this page
         */
        main: function(templateContext)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([includes.fetchTemplate(TEMPLATE_FILE),
                    appendCategoriesToTemplate(templateContext)])
                        .then(function(template)
                {
                    templateContext.adminPage = template[0];
                    resolve();
                }).catch(function(error)
                {
                    console.log("error in add adminHome.js");
                    reject(error);
                });
            });
        },

        processPostData: function(postData)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([processPostAddCategory(postData),
                    processPost(postData)])
                    .then(function()
                    {
                        console.log("all resolved");
                        resolve();
                    }).catch(function(error)
                    {
                        console.log("error in add downloads.js");
                        reject(error);
                    });
            });
        }
    };