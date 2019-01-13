//file io
const utils = require('../../utils/utils.js');

//update db
const sql = require('../../utils/sql');

//parse post data
const qs = require('querystring');








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