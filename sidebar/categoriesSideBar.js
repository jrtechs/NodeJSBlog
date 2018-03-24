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
                res.write("<div class=\"w3-card w3-margin\">");

                res.write("<div class=\"w3-container w3-padding w3-gray\"><h4>Categories</h4></div>");

                res.write("<div class=\"w3-bar-block w3-white\">");

                sql.getCategories().then(function(categories)
                {
                    categories.forEach(function(cat)
                    {
                        //res.write(cat.name);
                        res.write("<a class=\"w3-bar-item w3-button\" href='/category/" + cat.url + "'>" + cat.name + "<br></a>");
                    });
                    res.write("</div></div>");
                    resolve();
                })
            });
        }
    };
