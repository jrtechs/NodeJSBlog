/**
 * Determines what template and controls that will be
 * displayed based on the url such as
 *  /
 *  /blog
 *  /downloads
 *
 *  For each controls it calls that "pages" associated javascript file
 *  which fetches the template, deals with post data and gathers context
 *  for the template engine.
 */

//file IO
const utils = require('../utils/utils.js');


module.exports=
{
    /**
     *
     * @param request -- used to get post data
     * @param clientAddress -- used to see if user is banned for login
     * @param templateContext -- used by whiskers for information to plug
     * in the template
     * @param filename -- specific admin page requested
     * @returns {Promise} resolves once everything has been added to the template context
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