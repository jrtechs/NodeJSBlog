const utils = require('../utils/utils.js');
const Promise = require('promise');
const sql = require('../utils/sql');

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
                resolve("");
            }
        }).catch(function(err)
        {
            reject(err);
        })
    });
};


module.exports=
    {
        main: function(request)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([utils.include('./admin/login.html'),
                    require("../sidebar/sidebar.js").main(),
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