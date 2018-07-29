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
        main: function()
        {
            return new Promise(function(resolve, reject)
            {
                var content = "<br><br><div class=\"container\">";

                content += "<div class=\"list-group\">";

                content += "  <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start active\">\n" +
                    "      <h5 class=\"mb-1\">Categories</h5>\n" +
                    "  </a>";

                sql.getCategories().then(function(categories)
                {
                    categories.forEach(function(cat)
                    {
                        content += "<a class=\"list-group-item\" href='/category/" + cat.url + "'>" + cat.name + "<br></a>";
                    });
                    content += "</div></div><br>";
                    resolve(content);
                }).catch(function(error)
                {
                    reject(error);
                });
            });
        }
    };
