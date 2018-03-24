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

                res.write("<div class=\"w3-card w3-margin\">");

                res.write("<div class=\"w3-container w3-padding w3-gray\">" +
                    "<h4>Recent Posts</h4></div>");

                res.write("<div class=\"w3-bar-block w3-white\">");

                sql.getRecentPosts().then(function(posts)
                {
                    posts.forEach(function(p)
                    {
                        var url = '/' +  p.category + '/' + p.url;
                        res.write("<a class=\"w3-bar-item w3-button\" href='"
                            + url + "'>" + p.name + "<br></a>");
                    });
                    res.write("</div></div>");
                    resolve();
                })
            });
        }
    };