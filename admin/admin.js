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
    main: function(request, clientAddress, templateContext, filename)
    {
        console.log("admin main called");
        return new Promise(function(resolve, reject)
        {
            //if logged in
            if(request.session && request.session.user)
            {
                console.log(filename);
                templateContext.loggedIn = true;
                utils.getPostData(request).then(function (postData)
                {
                    console.log("temp 1");
                    var page = "./adminHome.js";
                    if(filename.includes('/downloads'))
                    {
                        page = "./adminDownloads.js";
                        console.log("downloads time")
                    }
                    else if(filename.includes("/posts"))
                    {
                        page = "./posts.js";
                    }

                    require(page).main(postData, templateContext).then(function(template)
                    {
                        templateContext.adminPage = template;
                        resolve();
                    }).catch(function(error)
                    {
                        console.log(error);
                    });

                    // console.log(postData);
                    // Promise.all([require("./posts/newPost.js").main(postData),
                    //     require("./category/addCategory.js").main(postData),
                    //     require("./posts/editPost.js").main(postData),
                    //     require("./downloads/adminDownloads.js").main(postData)])
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