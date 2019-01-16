const sql = require('../utils/sql');

const TEMPLATE_FILE = "blog/sideBar.html";

const includes = require('../includes/includes.js');


const getInformationForRecentPosts = function(templateContext)
{
    return new Promise(function(resolve, reject)
    {
        sql.getRecentPosts().then(function(posts)
        {
            posts.forEach(function(p)
            {
                p.url = '/' +  p.category + '/' + p.url;
            });
            templateContext.recentPosts = posts;
            resolve();
        }).catch(function(error)
        {
            reject(error);
        })
    });
};

const getInformationForCategories = function(templateContext)
{
    return new Promise(function(resolve, reject)
    {
        sql.getCategories().then(function(categories)
        {
            categories.forEach(function(cat)
            {
                cat.url = "/category/" + cat.url;
            });

            templateContext.categories = categories;
            resolve();
        }).catch(function(error)
        {
            reject(error);
        });
    });
};


module.exports=
    {
        main: function(templateContext)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([includes.fetchTemplate(TEMPLATE_FILE),
                    getInformationForRecentPosts(templateContext),
                    getInformationForCategories(templateContext)])
                        .then(function(content)
                {
                    templateContext.sideBar = content[0];
                    resolve();
                }).catch(function(error)
                {
                    reject(error);
                });
            })
        }
    };