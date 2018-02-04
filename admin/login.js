const utils = require('../utils/utils.js');
const Promise = require('promise');
const sql = require('../utils/sql');

var processLogin = function(result, request)
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
                result.write("<meta http-equiv=\"refresh\" content=\"0\">");
            }
            resolve();
        }).catch(function(err)
        {
            console.log(err);
            resolve();
        })
    });
};


module.exports=
    {
        main: function(result, request)
        {
            console.log("main of login.js");
            result.write("<div class=\"w3-col l8 s12\">");
            return new Promise(function(resolve, reject)
            {
                utils.include(result, './admin/login.html').then(function()
                {
                    console.log("got login html");
                    return require("../sidebar/sidebar.js").main(result);
                }).then(function()
                {
                    return processLogin(result, request);
                }).then(function()
                {
                    resolve();
                })
            });
        },
    };