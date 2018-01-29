const Promise = require('promise');
const sql = require('../utils/sql');

module.exports=
    {
        main: function(res)
        {
            console.log("sidebar called");
            return new Promise(function(resolve, reject)
            {

                res.write("<div class=\"w3-card w3-margin\">");

                res.write("        <div class=\"w3-container w3-padding\">\n" +
                    "\n" +
                    "            <h4>Popular Posts</h4>\n" +
                    "\n" +
                    "        </div>");


                res.write("<ul class=\"w3-ul w3-hoverable w3-white\">");

                sql.getCategories().then(function(categories)
                {
                    console.log(categories[0].name);
                    categories.forEach(function(cat)
                    {
                        //res.write(cat.name);
                        console.log(cat);
                        res.write("<li class=\"w3-padding-16\">");
                        //res.write("<a href=\"#\#\"  class=\"w3-bar-item w3-button\" style=\"width=100%\">" + cat.name + "</a>");

                        res.write("<a href='jrtechs.net'><span class=\"w3-large\">" + cat.name + "</span><br></a>");
                        res.write("</li>");

                    });
                    res.write("</ul></div>");
                    resolve();
                })

            });
        }
    };