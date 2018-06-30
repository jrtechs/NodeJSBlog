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
            if(request.session && request.session.user)
            {
                utils.getPostData(request).then(function (postData)
                {
                    return require("../admin/newPost.js").main(result, postData);
                }).then(function(postData)
                {
                    return require("../admin/addCategory.js").main(result, postData);
                }).then(function(postData)
                {
                    result.write("</div>"); //ends main row
                    return require("../admin/editPost.js").main(result, postData);
                }).then(function(postData)
                {
                    return require("../admin/addDownload.js").main(result, postData);
                }).then(function()
                {
                    resolve();
                }).catch(function(error)
                {
                    reject(error);
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