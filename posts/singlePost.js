const utils = require('../utils/utils.js');

var Promise = require('promise');

var markdown = require( "markdown" ).markdown;

const sql = require('../utils/sql');


module.exports=
{
    /**
     * renderPost() displays a single blog post in it's entirety
     *
     * @param res result sent to user
     * @param post sql data about the blog post
     * @return {*|Promise}
     */
    renderPost: function(res, post)
    {
        return new Promise(function (resolve, reject)
        {
            var html = "<div class=\"w3-card-4 w3-margin w3-white\">";
            //image
            if(!(post.picture_url === "n/a"))
            {
                html +="<img src=\"/img/posts/" + post.picture_url + "\" alt=\"Nature\" style=\"width:100%\">";
            }

            html += "<div class=\"w3-container\">";
            //title
            html += "<h3><b>" + post.name + "</b></h3>";
            //date
            html += "<h5><span class=\"w3-opacity\">" + post.published.toDateString() + "</span></h5>";
            html +="</div>";

            html += "<div class=\"w3-container\">";

            try
            {
                sql.getCategory(post.category_id).then(function(category)
                {
                    var pathName =  "entries/" + category[0].url + "/" + post.url + ".md";
                    html += markdown.toHTML(utils.getFileContents(pathName).toString());

                    html = html.split("<code>").join("<pre><code>");
                    html = html.split("</code>").join("</code></pre>");
                    html = html.split("\\`\\`\\`").join("```");
                    html = html.split("![](media/").join("![](" + "entries/" + category.url + "/media/");
                    html += "</div></div>";
                    res.write(html);
                    resolve()
                });
            }
            catch(ex)
            {
                //console.log(ex);
                //utils.include(res, "includes/404.html");
            }
        });
    }
};