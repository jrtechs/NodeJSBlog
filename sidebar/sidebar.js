const utils = require('../utils/utils.js');

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
                Promise.all([utils.include("sidebar/projectSidebar.html"),
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