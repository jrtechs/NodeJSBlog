const pandoc = require('node-pandoc');

const utils = require('../utils/utils.js');

const sql = require('../utils/sql');

const argsFull = '-S --base-header-level=1 --toc --toc-depth=3 -N --normalize -s --mathjax -t html5';
const argsPreview = '-S --normalize -s --mathjax -t html5';


module.exports=
    {

        /**
         * Renders the entire blog post based on the sql data pulled
         * from the database.
         *
         * @param post sql data which has title, date, and header img location
         * @param blocks number of blocks to display for a preview or -1 for
         * all the blocks
         * @returns {Promise} async call which renders the entire blog post.
         */
        generateBlogPost: function(post, blocks)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([module.exports.generateBlogPostHeader(post),
                    module.exports.generateBlogPostBody(post, blocks),
                    module.exports.generateBlogPostFooter()]).then(function(content)
                {
                    resolve(content.join(''));
                }).catch(function(error)
                {
                    reject(error);
                })
            });
        },

        /**
         * Renders the header of the blog post which contains the header image, and date
         * published.
         *
         * @param post sql data
         * @returns {string}
         */
        generateBlogPostHeader: function(post)
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
            htmlHead +="</div>" + "<div class=\"\">";

            return htmlHead;
        },


        /**
         * Method which renders the body of the blog post. This is responsible for getting
         * the contents of the markdown/latex file and rendering it into beautiful html.
         *
         * @param post stuff from the SQL table
         * @param blocks
         * @returns {Promise}
         */
        generateBlogPostBody: function(post, blocks)
        {
            return new Promise(function(resolve, reject)
            {
                sql.getCategory(post.category_id).then(function(category)
                {
                    resolve(module.exports.generateBlogPostComponent(category[0].url, post.url, blocks));
                });
            })
        },


        /**
         * Decomposition from Generate Blog Post used for the
         * blog previewer.
         *
         * @param categoryURL
         * @param postURL
         * @param blocks
         * @returns {Promise}
         */
        generateBlogPostComponent: function(categoryURL, postURL, blocks)
        {
            return new Promise(function(resolve, reject)
            {
                const pathName =  "blogContent/posts/" + categoryURL + "/"
                    + postURL + ".md";
                var markDown = utils.getFileContents(pathName).toString();
                markDown = markDown.split("(media/").join("(" + "../blogContent/posts/"
                    + categoryURL + "/media/");

                module.exports.convertToHTML(markDown, blocks).then(function(result)
                {

                    result = result.split("<figcaption>").join("<figcaption style=\"visibility: hidden;\">");

                    //this line prevents older versions of pandoc from including invalid cdm scripts
                    result = result.split("<script src=\"https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML-full\" type=\"text/javascript\"></script>").join("");
                    result = result.split("<script src=\"https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML\" type=\"text/javascript\"></script>").join("");

                    //stuff for youtube videos
                    var re = /\<youtube .*?>/;

                    //<youtube src="" />
                    while (result.search(re) != -1)
                    {
                        var ytid = result.substring(result.search(re) + 14, result.search(re)+ 11 + 14);
                        var youtubeHTML = "<div class=\"wrapper\">\n" +
                            "\t<div class=\"youtube\" data-embed=\"" +
                             ytid +
                            "\" />\n" +
                            "\t\t<div class=\"play-button\"></div>\n" +
                            "\t</div>\n" +
                            "</div>\n";

                        var original = "<youtube src=\"" + ytid + "\" />";

                        result = result.split(original).join(youtubeHTML);
                    }


                    if(blocks == -1)
                        resolve(result);

                    const htmlBlocks = result.split("<p>");
                    var html = "";
                    for(var i = 0; i < blocks; i++)
                    {
                        html += "<p>" + htmlBlocks[i];
                    }

                    html += "      <div style=\"\">\n" +
                        "          <p class='text-center'><button class=\"btn btn-secondary btn-lg " +
                        "w3-padding-large w3-white w3-border\"  onclick=\"location.href='" +
                        "http://jrtechs.net/" + categoryURL + "/" + postURL +
                        "'\"><b>READ MORE &raquo;</b></button></p>\n" +
                        "      </div>\n";

                    resolve(html);

                }).catch(function(error)
                {
                    reject(error);
                })
            })
        },


        /** Method to return the footer of the html blog post.
         *
         * @returns {string}
         */
        generateBlogPostFooter: function()
        {
            return "</div></div></div><br><br>";
        },


        /**
         * Converts markdown into html.
         *
         * @param markdownContents
         * @param type
         * @returns {Promise}
         */
        convertToHTML: function(markdownContents, type)
        {
            return new Promise(function(resolve, reject)
            {
                // Set your callback function
                callback = function (err, html)
                {
                    if (err)
                    {
                        reject(err);
                    }


                    html = html.split("<img").join("<img style=\"max-width: 100%;\" ");
                    html = html.split("<code>").join("<code class='hljs cpp'>");


                    resolve(html);
                };
                if(type == -1)
                {
                    pandoc(markdownContents, argsFull, callback);
                }
                else
                {
                    pandoc(markdownContents, argsPreview, callback);
                }
            });
        },
    }
