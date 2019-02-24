const pandoc = require('node-pandoc');

const utils = require('../utils/utils.js');

const sql = require('../utils/sql');

const argsFull = '--from markdown-markdown_in_html_blocks+raw_html -S --base-header-level=1 --toc --toc-depth=3 -N --normalize -s --mathjax -t html5';
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
                    module.exports.generateBlogPostBody(post, blocks)])
                        .then(function()
                {
                    resolve(post);
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
            if(post.picture_url !== "n/a")
                post. hasPicture = true;

            post.published = post.published.toDateString();
            return;
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
                    module.exports.generateBlogPostComponent(category[0].url, post.url, blocks).then(function(html)
                    {
                       post.blogBody = html;
                       resolve();
                    });
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


                    var regExp = /\<customHTML .*?>/;
                    while (result.search(regExp) != -1)
                    {
                        const pathName =  "blogContent/posts/" + categoryURL + "/html/"
                            + postURL + ".html";

                        var htmlContent = utils.getFileContents(pathName).toString();

                        result = result.split("<customHTML />").join(htmlContent);
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


        /**
         * Renders a bunch of blog post  previews to the user
         *
         * @param baseURL-- url of the page
         * @param posts -- sql data about the blog to render
         * @param currentPage -- the current page to render
         * @param numOfPosts -- number of blog to render
         * @returns {Promise} renders the html of the blog
         */
        renderBatchOfPosts: function(baseURL, posts, currentPage, numOfPosts, templateContext)
        {
            if(typeof currentPage == "undefined")
            {
                currentPage = 1;
            }
            else
            {
                currentPage = Number(currentPage);
            }

            return new Promise(function(resolve, reject)
            {
                const promises = [];
                for(var i = (currentPage-1) * numOfPosts; i < (currentPage-1) * numOfPosts + numOfPosts; i++)
                {
                    if(i < posts.length)
                    {
                        promises.push(new Promise(function(res, rej)
                        {
                            module.exports.generateBlogPost(posts[i], posts.length === 1 ? -1: 3).then(function(tempContext)
                            {
                                res(tempContext);
                            }).catch(function(error)
                            {
                                rej();
                            })
                        }));
                    }
                }

                //promises.push(require('../blog/renderNextBar').main(baseURL, currentPage, numOfPosts, blog.length));

                Promise.all(promises).then(function(posts)
                {
                    templateContext.posts = posts;
                    resolve();
                }).catch(function(error)
                {
                    reject(error);
                });
            });
        }
    }
