const utils = require('../utils/utils.js');
const Promise = require('promise');

module.exports=
    {
        /** Method which renders the entire sidebar through calling
         * appropriate widget js files.
         *
         * @param res
         * @returns {*|Promise}
         */
        main: function()
        {
            return new Promise(function(resolve, reject)
            {
                console.log("sidebar  page");

                // res.write("<div class=\"col-md-4\">");
                //
                // utils.include(res,"sidebar/sidebar.html").then(function()
                // {
                //     return require("../sidebar/recentPosts.js").main(res);
                // }).then(function()
                // {
                //     return require("../sidebar/categoriesSideBar.js")
                //         .main(res);
                // }).then(function()
                // {
                //     res.write("</div>");
                //     resolve();
                // }).catch(function(err)
                // {
                //     console.log("hit error");
                //     console.log(err);
                // })

                Promise.all([utils.include("sidebar/sidebar.html"),
                    require("../sidebar/recentPosts.js").main(),
                    require("../sidebar/categoriesSideBar.js").main()]).then(function(content)
                {
                    resolve("<div class=\"col-md-4\">" + content.join('') + "</div>");
                }).catch(function(error)
                {
                    reject(error);
                });
            })
        }
    };