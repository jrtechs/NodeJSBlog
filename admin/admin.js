const utils = require('../utils/utils.js');
var Promise = require('promise');
var session = require('client-sessions');

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
                console.log("user logged in");
                utils.getPostData(request).then(function (postData)
                {
                    return require("../admin/newPost.js").main(result, postData);
                }).then(function(postData)
                {
                    return require("../admin/addCategory.js").main(result, postData);
                }).then(function(postData)
                {
                    result.write("</div>");
                    console.log("hmmm");
                    return require("../admin/editPost.js").main(result, postData);
                }).then(function()
                {
                    resolve();
                }).catch(function(error)
                {
                    throw error;
                });
            }
            else
            {
                //login page
                require("../admin/login.js").main(result, request).then(function()
                {
                    resolve();
                }).catch(function(err)
                {
                    console.log(err);
                })
            }

        });
    }
};