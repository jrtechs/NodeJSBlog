const utils = require('../utils/utils.js');
var Promise = require('promise');

module.exports=
{
    /**
     * Method calls the admin widgets it correct order
     *
     * @param result
     * @param fileName
     * @param request
     * @return {*|Promise}
     */
    main: function(result, fileName, request)
    {
        return new Promise(function(resolve, reject)
        {
            result.write("<div class=\"w3-row\">");
            utils.getPostData(request).then(function (postData)
            {
                return require("../admin/newPost.js").main(result, postData);
            }).then(function(postData)
            {
                return require("../admin/addCategory.js").main(result, postData);
            }).then(function()
            {
                console.log("admin page ended");
                resolve();
            })
            result.write("</div>");
        });
    }
};