const utils = require('../utils/utils.js');
const sql = require('../utils/sql');

const qs = require('querystring');
var Promise = require('promise');


module.exports=
    {
        /**
         *
         * @param res
         * @param postData
         * @return {*}
         */
        main: function(res, postData)
        {
            utils.include(res, "./admin/newPost.html");
            return this.processPost(res, postData);
        },
        /**
         *
         * @param res
         * @param postData
         * @return {*|Promise}
         */
        processPost: function(res, postData)
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
                    })
                }
                else
                {
                    resolve(postData);
                }
            });
        }
    };