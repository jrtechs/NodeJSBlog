const Promise = require('promise');
const sql = require('../utils/sql');

module.exports=
    {
        /** Renders the the recent post sidebar.
         *
         * @returns {*|Promise}
         */
        main: function()
        {
            return new Promise(function(resolve, reject)
            {
                var content = "<div class=\"container\">";

                content +="<div class=\"list-group\">";

                content +="  <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start active\">\n" +
                    "      <h5 class=\"mb-1\">Recent Posts</h5>\n" +
                    "  </a>";

                sql.getRecentPosts().then(function(posts)
                {
                    posts.forEach(function(p)
                    {
                        var url = '/' +  p.category + '/' + p.url;
                        content += "<a class=\"list-group-item\" href='"
                            + url + "'>" + p.name + "<br></a>";
                    });
                    content +="</div></div>";
                    resolve(content);
                }).catch(function(error)
                {
                    reject(error);
                })
            });
        }
    };