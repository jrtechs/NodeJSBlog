const Promise = require('promise');
const sql = require('../utils/sql');

module.exports=
    {
        /**
         * Responsible for querying the database and displaying all
         * categories that the blog has in the sidebar
         *
         * @param res
         * @return {*|Promise}
         */
        main: function(res)
        {
            return new Promise(function(resolve, reject)
            {
                res.write("<br><br><div class=\"container\">");

                //res.write("<div class=\"w3-container w3-padding w3-gray\"><h4>Categories</h4></div>");

                //res.write("<div class=\"container\"><h4 class=\"align-content-center\">Categories</h4></div>");

                //res.write("<div class=\"w3-bar-block w3-white\">");
                res.write("<div class=\"list-group\">");

                res.write("  <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start active\">\n" +
                    "      <h5 class=\"mb-1\">Categories</h5>\n" +
                    "  </a>");

                sql.getCategories().then(function(categories)
                {
                    categories.forEach(function(cat)
                    {
                        //res.write(cat.name);
                        res.write("<a class=\"list-group-item\" href='/category/" + cat.url + "'>" + cat.name + "<br></a>");
                    });
                    res.write("</div></div><br>");
                    resolve();
                })
            });
        }
    };
