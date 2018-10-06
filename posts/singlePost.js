const utils = require('../utils/utils.js');

const sql = require('../utils/sql');

const Remarkable = require('remarkable');
const hljs       = require('highlight.js');

const pandoc = require('../utils/markdownToHTML.js');


const md = new Remarkable(
{
    html:         true,
    highlight: function (str, lang)
    {
        if (lang && hljs.getLanguage(lang))
        {
            try
            {
                return hljs.highlight(lang, str).value;
            }
            catch (err) {}
        }

        try
        {
            return hljs.highlightAuto(str).value;
        }
        catch (err) {}

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
    renderPreview: function(post)
    {
       return new Promise(function(resolve, reject)
       {
           //var html = "<div class=\"w3-card-4 w3-margin w3-white\">";

           var html = "<div class=\"blogPost\">";

           //image
           if(!(post.picture_url === "n/a"))
           {
               html +="<img src=\"/blogContent/headerImages/" + post.picture_url +
                   "\" alt=\"\" style=\"width:100%; height:10%\">";
           }

           html += "<div class=\"p-4\"><div class=\"\">";
           //title
           html += "<h3><b>" + post.name + "</b></h3>";
           //date
           html += "<h5><span class=\"w3-opacity\">" +
               post.published.toDateString() + "</span></h5>";
           html +="</div>";

           html += "<div class=\"\">";

           try
           {
               sql.getCategory(post.category_id).then(function(category)
               {
                   var pathName =  "blogContent/posts/" + category[0].url + "/"
                       + post.url + ".md";
                   var markDown = utils.getFileContents(pathName).toString();

                   markDown = markDown.split("(media/").join("(" + "../blogContent/posts/"
                       + category[0].url + "/media/");
                   var htmlPost = md.render(markDown).split("<p>");

                   for(var i = 0; i < 3; i++)
                   {
                       html+= "<p>" + htmlPost[i];
                   }

                   html = html.split("<img").join("<img style=\"width: 100%; height:10%\" ");
                   html = html.split("<code>").join("<code class='hljs cpp'>");

                   html += "      <div class=\"\">\n" +
                       "          <p class='text-center'><button class=\"btn btn-secondary btn-lg " +
                       "w3-padding-large w3-white w3-border\"  onclick=\"location.href='" +
                       "http://jrtechs.net/" + category[0].url + "/" + post.url +
                       "'\"><b>READ MORE &raquo;</b></button></p>\n" +
                       "      </div>\n";

                   html += "</div></div></div><br><br>";

                   resolve(html)
               }).catch(function(error)
               {
                   reject(error);
               });
           }
           catch(ex)
           {
               reject(ex);
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
    renderPost: function(post)
    {
        return new Promise(function (resolve, reject)
        {
            var htmlHead = "<div class=\"blogPost\">";
            //image
            if(!(post.picture_url === "n/a"))
            {
                htmlHead +="<img src=\"/blogContent/headerImages/" + post.picture_url +
                    "\" alt=\"\" style=\"width:100%; height:10%\">";
            }

            htmlHead += "<div class=\"p-4\"><div class=\"\">";
            //title
            htmlHead += "<h3><b>" + post.name + "</b></h3>";
            //date
            htmlHead += "<h5><span class=\"w3-opacity\">" +
                post.published.toDateString() + "</span></h5>";
            htmlHead +="</div>";

            var html = "<div class=\"\">";
            try
            {
                sql.getCategory(post.category_id).then(function(category)
                {
                    const pathName =  "blogContent/posts/" + category[0].url + "/"
                        + post.url + ".md";
                    var markDown = utils.getFileContents(pathName).toString();
                    markDown = markDown.split("(media/").join("(" + "../blogContent/posts/"
                        + category[0].url + "/media/");
                    //html += md.render(markDown);

                    pandoc.convertToHTML(markDown).then(function(result)
                    {
                        html +=result;

                        html = html.split("<img").join("<img style=\"max-width: 100%;\" ");
                        html = html.split("<code>").join("<code class='hljs cpp'>");
                        html += "</div></div></div><br><br>";

                        resolve(htmlHead + html);
                    }).catch(function(error)
                    {
                        reject(error);
                    })

                });
            }
            catch(ex)
            {
                reject(ex);
            }
        });
    }
};