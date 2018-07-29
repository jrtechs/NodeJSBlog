const sql = require('../utils/sql');

module.exports=
    {
        /**Renders the popular posts sidebar.
         *
         * @param res
         * @returns {*|Promise}
         */
        main: function(res)
        {
            return new Promise(function(resolve, reject)
            {
                res.write("<div class=\"w3-card w3-margin\">");

                res.write("<div class=\"w3-container w3-padding\">" +
                    "<h4>Popular Posts</h4></div>");

                res.write("<div class=\"w3-sidebar w3-bar-block\">");

                sql.getPopularPosts().then(function(posts)
                {
                    posts.forEach(function(cat)
                    {
                        console.log(cat);

                        res.write("<a class=\"w3-bar-item w3-button\" href='"
                            + url + "'>" + p.name + "<br></a>");
                    });
                    res.write("</div></div>");
                    resolve();
                });
            });
        }
    };