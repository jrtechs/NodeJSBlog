//file io
const utils = require('../../utils/utils.js');

//update db
const sql = require('../../utils/sql');


/**
 * Processes post data to see if the user has successfully
 * logged in. If the user has logged in successfully, a session
 * variable is set and the page is refreshed.
 *
 * @param request
 * @returns {Promise}
 */
const processLogin = function(request)
{
    return new Promise(function(resolve, reject)
    {
        utils.getPostData(request).then(function(postData)
        {
            return sql.checkLogin(postData);
        }).then(function(loginResult)
        {

            if(loginResult.pass)
            {
                request.session.user = loginResult.user;
                console.log("user has logged in");
                resolve("<meta http-equiv=\"refresh\" content=\"0\">");
            }
            else
            {
                console.log("password incorrect");
                resolve("Password incorrect");
            }
        }).catch(function(err)
        {
            reject(err);
        })
    });
};


module.exports=
    {
        /**
         * Renders the contents of the login page of the website
         *
         * @param request express request containing post data
         * @returns {Promise} resolves html of login page
         */
        main: function(request)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([utils.include("./admin/login/login.html"),
                    require("../../sidebar/sidebar.js").main(),
                    processLogin(request)]).then(function(html)
                {
                    resolve(html.join('') + "</div>");
                }).catch(function(err)
                {
                    reject(err);
                })
            });
        },
    };