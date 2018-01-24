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
                res.write("<div class=\"w3-card w3-margin w3-margin-top\">");

                res.write("        <div class=\"w3-container w3-padding\">\n" +
                    "\n" +
                    "            <h3>Categories</h3>\n" +
                    "\n" +
                    "        </div>");


                res.write("<div class=\"w3-container w3-white\">");

                res.write("<ol>");
                sql.getCategories().then(function(categories)
                {
                    console.log(categories[0].name);
                    categories.forEach(function(cat)
                    {
                        //res.write(cat.name);
                        console.log(cat);

                        res.write("<a href=\"#\#\"  class=\"w3-bar-item w3-button\" style=\"width=100%\">" + cat.name + "</a>");
                        res.write("<br />");
                    });
                    res.write("</ol>");
                    res.write("</div></div>");
                    resolve();
                })

            });
        }
    };