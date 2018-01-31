const utils = require('../utils/utils.js');
var Promise = require('promise');

module.exports=
    {
        main: function(res)
        {
            return new Promise(function(resolve, reject)
            {
                res.write("<div class=\"w3-col l4\">");

                utils.include(res,"sidebar/sidebar.html").then(function()
                {
                    return require("../sidebar/recentPosts.js").main(res);
                }).then(function()
                {
                    return require("../sidebar/categoriesSideBar.js").main(res);
                }).then(function()
                {
                    res.write("</div>");
                    resolve();
                }).catch(function(err)
                {
                    console.log("hit error");
                    console.log(err);
                })
            })
        }
    };