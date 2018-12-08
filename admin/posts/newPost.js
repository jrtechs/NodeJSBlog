const utils = require('../../utils/utils.js');
const sql = require('../../utils/sql');

const qs = require('querystring');
const Promise = require('promise');


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
                var map = require('../../utils/generateSiteMap');
                map.main();
                resolve("");
            }).catch(function(error)
            {
                reject(error);
            })
        }
        else if(post.clear_cache)
        {
            require("../../sites/blog.js").clearCache();
            require("../../includes/includes.js").clearCache();
        }
        else if(post.git_pull)
        {
            const execSync = require('child_process').execSync;
            code = execSync('git pull')
        }
        else
        {
            resolve("");
        }
    });
};


module.exports=
    {
        /**
         *
         * @param postData
         * @return {*}
         */
        main: function(postData)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([utils.include("./admin/posts/newPost.html"), processPost(postData)]).then(function(html)
                {
                    resolve(html.join(''));
                }).catch(function(error)
                {
                    reject(error);
                })
            });
        }
    };