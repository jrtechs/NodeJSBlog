const pandoc = require('node-pandoc');

const utils = require('../utils/utils.js');

const sql = require('../utils/sql');

const argsFull = '--from markdown-markdown_in_html_blocks+raw_html --toc --toc-depth=3 -N --mathjax -t html5 --no-highlight';
const argsPreview = '--mathjax -t html5';


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
                post.hasPicture = true;

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
                        post.categoryURL = category[0].url;
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
                    // hackey stuff to fix this open issue on pandoc https://github.com/jgm/pandoc/issues/3858
                    //search for pattern <pre class="LANG"><code> and replace with <code class="language-LANG">
                    var re = /\<pre class=".*?"><code>/;
                    while (result.search(re) != -1)
                    {
                        var preTag = result.match(/\<pre class=".*?"><code>/g)[0];
                        var finishIndex = preTag.split('"', 2).join('"').length;
                        lang = preTag.substring(12, finishIndex);
                        var newHTML = `<pre><code class="language-${lang}">`
                        var original = `<pre class="${lang}"><code>`;
                        result = result.split(original).join(newHTML);
                    }

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
                        var youtubeHTML = `
                            <div class="wrapper">
                                <div class="youtube" data-embed="${ytid}">
                                    <div class="play-button"></div>
                                </div>
                            </div>`;

                        var original = `<youtube src="${ytid}" />`;

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
            if(type == -1)
            {
                return module.exports.pandocWrapper(markdownContents, argsFull);
            }
            else
            {
                return module.exports.pandocWrapper(markdownContents, argsFull);
            }
        },


        pandocWrapper: function(markdownContents, pandocArgs)
        {
            return new Promise((resolve, reject)=>
            {
                // Set your callback function
                callback = function (err, html)
                {
                    if (err)
                    {
                        reject(err);
                    }

                    if(html === undefined)
                    {
                        resolve("");
                    }
                    else
                    {
                        html = html.split("<img").join("<img style=\"max-width: 100%;\" ");
                        // html = html.split("<code>").join("<code class='hljs cpp'>");
                        resolve(html);
                    }
                };
                pandoc(markdownContents, pandocArgs, callback);
            });
        },


        /**
         * Renders a bunch of blog post previews to the user
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
                                if(posts.length != 1)
                                {
                                    templateContext.preview = true
                                }
                                res(tempContext);
                            }).catch(function(error)
                            {
                                rej();
                            })
                        }));
                    }
                }

                Promise.all(promises).then(function(posts)
                {
                    templateContext.posts = posts;
                    if(posts.length == 1)
                        templateContext.title = posts[0].name;
                    else if(currentPage != 1 && baseURL === "/")
                        templateContext.title = "page " + currentPage;
                    resolve();
                }).catch(function(error)
                {
                    reject(error);
                });
            });
        }
    };
