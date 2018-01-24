const utils = require('../utils/utils.js');
const sql = require('../utils/sql');

const qs = require('querystring');
var Promise = require('promise');


module.exports=
    {
        main: function(res, postData)
        {
            utils.include(res, "./admin/newPost.html");
            return this.processPost(res, postData);
        },
        processPost: function(res, postData)
        {
            return new Promise(function(resolve, reject)
            {
                var post = qs.parse(postData);
                if(post.add_post_name)
                {

                }
                resolve(postData);
            });
        }
    };