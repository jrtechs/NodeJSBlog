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
    main: function(request, clientAddress)
    {
        return new Promise(function(resolve, reject)
        {
            if(request.session && request.session.user)
            {
                utils.getPostData(request).then(function (postData)
                {
                    console.log(postData);
                    Promise.all([require("./posts/newPost.js").main(postData),
                        require("./category/addCategory.js").main(postData),
                        require("./posts/editPost.js").main(postData),
                        require("./downloads/manageDownloads.js").main(postData)])
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
                require("./login/login.js").main(request).then(function(html)
                {
                    resolve(html);
                }).catch(function(err)
                {
                    console.log(err);
                    reject(err);
                })
            }
        });
    }
};