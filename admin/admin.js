/**
 * Renders the admin page contents
 */

//file IO
const utils = require('../utils/utils.js');




module.exports=
{
    /**
     * Method calls the admin widgets it correct order
     *
     * @param request
     * @return {*|Promise}
     */
    main: function(request, clientAddress, templateContext)
    {
        return new Promise(function(resolve, reject)
        {
            //if logged in
            if(request.session && request.session.user)
            {
                templateContext.loggedIn = true;
                utils.getPostData(request).then(function (postData)
                {
                    resolve();
                    // console.log(postData);
                    // Promise.all([require("./posts/newPost.js").main(postData),
                    //     require("./category/addCategory.js").main(postData),
                    //     require("./posts/editPost.js").main(postData),
                    //     require("./downloads/manageDownloads.js").main(postData)])
                    //         .then(function(content)
                    // {
                    //     resolve(content.join(''));
                    // }).catch(function(error)
                    // {
                    //     reject(error);
                    // });
                });
            }
            else
            {
                require("./login/login.js").main(request, clientAddress, templateContext).then(function()
                {
                    resolve();
                }).catch(function(err)
                {
                    console.log(err);
                    reject(err);
                })
            }
        });
    }
};