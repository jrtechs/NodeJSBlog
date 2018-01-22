const utils = require('../utils/utils.js');
const sql = require('../utils/sql');

const qs = require('querystring');
var Promise = require('promise');



module.exports=
{
    main: function(res, postData)
    {
        utils.include(res, "./admin/addCategory.html");
        return this.processPost(res, postData);
    },
    processPost: function(res, postData)
    {
        return new Promise(function(resolve, reject)
        {
            var post = qs.parse(postData);
            if(post.add_category)
            {
                var url = post.add_category.replace(/ /i, "-");
                var q = "insert into categories (name, url) values " +
                    "('" + post.add_category + "','" + url + "')";
                console.log(q);
                if(sql.insert(q) != 0)
                {
                    console.log("category added");
                }
                else
                {
                    console.log("error adding category");
                }

            }
            resolve();
        });
    }
};