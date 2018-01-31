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
        result.write("<div class=\"w3-row\">");
        return new Promise(function(resolve, reject)
        {
            if(request.session && request.session.user)
            {

                utils.getPostData(request).then(function (postData)
                {
                    return require("../admin/newPost.js").main(result, postData);
                }).then(function(postData)
                {
                    return require("../admin/addCategory.js").main(result, postData);
                }).then(function()
                {
                    result.write("</div>");
                    resolve();
                });
            }
            else
            {
                //login page
                return require("../admin/login.js").main(result, request);
            }

        });
    }
};