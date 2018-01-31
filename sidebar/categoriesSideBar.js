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

                res.write("<div class=\"w3-container w3-padding\"><h4>Categories</h4></div>");

                res.write("<ul class=\"w3-ul w3-hoverable w3-white\">");

                sql.getCategories().then(function(categories)
                {
                    categories.forEach(function(cat)
                    {
                        //res.write(cat.name);
                        res.write("<li class=\"w3-padding-16\">");

                        res.write("<a href='/category/" + cat.url + "'><span class=\"w3-large\">" + cat.name + "</span><br></a>");
                        res.write("</li>");

                    });
                    res.write("</ul></div>");
                    resolve();
                })

            });
        }
    };
