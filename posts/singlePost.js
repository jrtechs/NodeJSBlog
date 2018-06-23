const utils = require('../utils/utils.js');

var Promise = require('promise');

var markdown = require( "markdown" ).markdown;

const sql = require('../utils/sql');

var Remarkable = require('remarkable');
var hljs       = require('highlight.js') // https://highlightjs.org/

// Actual default values
var md = new Remarkable({
    html:         true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {}
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) {}

        return ''; // use external default escaping
    }
});


module.exports=
{
    /**
     * Renders a preview of the post with a link to view more
     *
     * @param res
     * @param post
     */
    renderPreview: function(res, post)
    {
       return new Promise(function(resolve, reject)
       {
           //var html = "<div class=\"w3-card-4 w3-margin w3-white\">";

           var html = "<div class=\"row\">";

           //image
           if(!(post.picture_url === "n/a"))
           {
               html +="<img src=\"/img/posts/" + post.picture_url +
                   "\" alt=\"\" style=\"width:100%\">";
           }

           html += "<div class=\"container\">";
           //title
           html += "<h3><b>" + post.name + "</b></h3>";
           //date
           html += "<h5><span class=\"w3-opacity\">" +
               post.published.toDateString() + "</span></h5>";
           html +="</div>";

           html += "<div class=\"container\">";

           try
           {
               sql.getCategory(post.category_id).then(function(category)
               {
                   var pathName =  "entries/" + category[0].url + "/"
                       + post.url + ".md";
                   var markDown = utils.getFileContents(pathName).toString();

                   markDown = markDown.split("![](media/").join("![](" + "../entries/"
                       + category[0].url + "/media/");
                   var htmlPost = md.render(markDown).split("<p>");

                   for(var i = 0; i < 3; i++)
                   {
                       html+= "<p>" + htmlPost[i];
                   }

                   html = html.split("<img").join("<img style=\"max-width: 100%;\" ");

                   html += "      <div class=\"row\">\n" +
                       "          <p class='w3-center'><button class=\"w3-button " +
                       "w3-padding-large w3-white w3-border\"  onclick=\"location.href='" +
                       "http://jrtechs.net/" + category[0].url + "/" + post.url +
                       "'\"><b>READ MORE &raquo;</b></button></p>\n" +
                       "      </div>\n";

                   html += "</div></div>";
                   res.write(html);

                   resolve()
               }).catch(function(error)
               {
                   console.log(error);
                   reject(error);
               });
           }
           catch(ex)
           {
               reject(ex);
               console.log(ex);
           }
       });
    },

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
            var html = "<div class=\"container\">";
            //image
            if(!(post.picture_url === "n/a"))
            {
                html +="<img src=\"/img/posts/" + post.picture_url +
                    "\" alt=\"\" style=\"width:100%\">";
            }

            html += "<div class=\"container\">";
            //title
            html += "<h3><b>" + post.name + "</b></h3>";
            //date
            html += "<h5><span class=\"w3-opacity\">" +
                post.published.toDateString() + "</span></h5>";
            html +="</div>";

            html += "<div class=\"container\">";
            try
            {
                sql.getCategory(post.category_id).then(function(category)
                {
                    var pathName =  "entries/" + category[0].url + "/"
                        + post.url + ".md";
                    var markDown = utils.getFileContents(pathName).toString();
                    markDown = markDown.split("![](media/").join("![](" + "../entries/"
                        + category[0].url + "/media/");
                    html += md.render(markDown);

                    html = html.split("<img").join("<img style=\"max-width: 100%;\" ");
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