const utils = require('../utils/utils.js');
const Promise = require('promise');

module.exports=
{
    /**
     * Method calls the admin widgets it correct order
     *
     * @param fileName
     * @param request
     * @return {*|Promise}
     */
    main: function(fileName, request)
    {
        return new Promise(function(resolve, reject)
        {
            if(request.session && request.session.user)
            {
                utils.getPostData(request).then(function (postData)
                {
                    Promise.all([require("../admin/newPost.js").main(postData),
                        require("../admin/addCategory.js").main(postData),
                        require("../admin/editPost.js").main(postData),
                        require("./manageDownloads.js").main(postData)])
                            .then(function(content)
                    {
                        resolve(content.join(''));
                    }).catch(function(error)
                    {
                        reject(error);
                    });
                });
            }
            else
            {
                //login page
                console.log("login page");
                require("../admin/login.js").main(request).then(function(html)
                {
                    resolve(html);
                }).catch(function(err)
                {
                    console.log(err);
                })
            }
        });
    }
};