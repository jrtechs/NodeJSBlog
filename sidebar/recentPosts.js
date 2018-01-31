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

                res.write("<div class=\"w3-container w3-padding\"><h4>Recent Posts</h4></div>");

                res.write("<ul class=\"w3-ul w3-hoverable w3-white\">");

                sql.getRecentPosts().then(function(posts)
                {
                    posts.forEach(function(p)
                    {
                        var url = '/' +  p.category + '/' + p.url;
                        res.write("<li class=\"w3-padding-16\">");
                        res.write("<a href='" + url + "'><span class=\"w3-large\">" + p.name + "</span><br></a>");
                        res.write("</li>");
                    });
                    res.write("</ul></div>");
                    resolve();
                })

            });
        }
    };