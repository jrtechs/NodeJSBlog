const utils = require('../../utils/utils.js');
const sql = require('../../utils/sql');

const qs = require('querystring');





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