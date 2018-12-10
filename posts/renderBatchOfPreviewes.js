
module.exports=
    {
        /**
         * Calls posts and sidebar modules to render blog contents in order
         *
         * @param res
         * @param fileName request url
         */
        main: function(baseURL, posts, currentPage, numOfPosts)
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
                            require("../posts/singlePost.js")
                                .renderPreview(posts[i]).then(function(html)
                            {
                                res(html);
                            }).catch(function(error)
                            {
                                rej(error);
                            })
                        }));
                    }
                }

                promises.push(require('../posts/renderNextBar').main(baseURL, currentPage, numOfPosts, posts.length));

                Promise.all(promises).then(function(content)
                {
                    resolve("<div class='col-md-8'>" + content.join('') + "</div>");
                }).catch(function(error)
                {
                    reject(error);
                });
            });
        }
    };