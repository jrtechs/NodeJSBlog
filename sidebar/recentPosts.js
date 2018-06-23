const Promise = require('promise');
const sql = require('../utils/sql');

module.exports=
    {
        /** Renders the the recent post sidebar.
         *
         * @param res
         * @returns {*|Promise}
         */
        main: function(res)
        {
            return new Promise(function(resolve, reject)
            {

                res.write("<div class=\"container\">");

                // res.write("<div class=\"\">" +
                //     "<h4 class=\"text-center\">Recent Posts</h4></div>");

                res.write("<div class=\"list-group\">");

                res.write("  <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start active\">\n" +
                    "      <h5 class=\"mb-1\">Recent Posts</h5>\n" +
                    "  </a>");

                sql.getRecentPosts().then(function(posts)
                {
                    posts.forEach(function(p)
                    {
                        var url = '/' +  p.category + '/' + p.url;
                        res.write("<a class=\"list-group-item\" href='"
                            + url + "'>" + p.name + "<br></a>");
                    });
                    res.write("</div></div>");
                    resolve();
                })
            });
        }
    };