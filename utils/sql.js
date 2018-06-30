const mysql = require('mysql');

const sanitizer = require('sanitizer');

const Promise = require('promise');

const crypto = require('crypto');

const qs = require('querystring');

const utils = require('../utils/utils.js');

var con = mysql.createConnection({
    host: "localhost",
    user: "blog_user",
    password: utils.getFileLine('../sql_secret'),
    database: "jrtechs_blog"
});


con.connect(function(err) {
    if (err) throw err;
});

/**
 * Function used to query the database for records
 *
 * @param sqlStatement
 * @returns {Array}
 */
var fetch = function(sqlStatement)
{
    return new Promise(function(resolve, reject)
    {
        con.query(sanitizer.sanitize(sqlStatement), function (err, result)
        {
            if(err)
            {
                console.log(err);
                reject(err);
            }
            resolve(result);
        });
    });
};

module.exports=
{
    /**
     * Function used to use insert statements into the database
     *
     * Don't worry, the input gets sanitized
     *
     * @param sqlStatement
     * @return the id of the new record - if there is one
     */
    insert : function(sqlStatement)
    {
        return new Promise(function(resolve, reject)
        {
            con.query(sanitizer.sanitize(sqlStatement), function (err, result)
            {
                if (err)
                {
                    console.log(err);
                    resolve(0);
                }
                resolve(result.insertId);
            });
        })
    },

    /**
     * function which fetches the sql info on a post based on it's sql id
     * @param id
     * @returns {Array}
     */
    getPostById: function(id)
    {
        console.log("select * from posts where post_id='" + id + "' limit 1");

        return new Promise(function(resolve, reject)
        {
            fetch("select * from posts where post_id='" + id + "' limit 1")
                .then(function(post)
            {
                resolve(post[0]);
            }).catch(function(error)
            {
                reject(error);
            });
        });
    },

    /**
     * Not to be mistaken for getPostData() in @file utils/utils.js,
     * this function extracts a post entry from the sql server
     *
     * @param requestURL url user used to request blog post
     * @return {*} the entry found in the data base -- if any
     */
    getPost : function(requestURL)
    {
        return new Promise(function(resolve, reject)
        {
            var splitURL = requestURL.split("/")
            var q = "select * from categories where url='" + splitURL[1] + "'";

            fetch(q).then(function (result_category)
            {
                if(result_category.length != 0)
                {

                    var q2 = "select * from posts where category_id='" +
                        result_category[0].category_id +
                        "'  and url='" + splitURL[2] + "'";

                    fetch(q2).then(function (result_posts)
                    {
                        if(result_posts != 0)
                        {
                            resolve(result_posts[0]);
                        }
                        else
                        {
                            resolve(0);
                        }
                    });
                }
                else
                {
                    resolve(0);
                }

            });

        });
    },
    /**
     * Function used to retrieve all categories when making the sidebar
     *
     * @return {Promise<Response> | * | Array}
     */
    getCategories : function()
    {
        var q = "select * from categories";
        return fetch(q);
    },

    /**
     * Function which currently returns all posts of a particular
     * category from the database
     * @param requestURL
     * @return {*|Promise}
     */
    getPostsFromCategory: function(requestURL)
    {
        return new Promise(function(resolve, reject)
        {
            var q = "select * from categories where url ='" + requestURL + "'";
            fetch(q).then(function(categories)
            {
                if(categories.length != 0)
                {
                    var qPosts = "select * from posts where category_id='" +
                        categories[0].category_id + "' order by published desc";
                    resolve(fetch(qPosts));
                }
                else
                {
                    resolve([]);
                }
            });
        });
    },


    /**
     * Fetches the recent posts from the database.
     * @returns {Array}
     */
    getRecentPostSQL: function()
    {
        return fetch("select * from posts order by post_id desc limit 10");
    },

    /**
     * Helper method which returns a list of objects which contains the url
     * and name of thee ten most recent posts
     *
     * {[name: , url: ],[name: , url: ],[name: , url: ],...}
     *
     * @return {*|Promise}
     */
    getRecentPosts: function()
    {
        return new Promise(function(resolve, reject)
        {
            var q = "select name,url, category_id from posts order " +
                "by post_id desc limit 10";
            fetch(q).then(function(sqlPosts)
            {
                var promises = [];
                sqlPosts.forEach(function(post)
                {
                    promises.push(new Promise(function(res, rej)
                    {
                        var getCategory = "select url from categories where " +
                            "category_id='" + post.category_id + "'";
                        fetch(getCategory).then(function(urls)
                        {
                            var obj = new Object();
                            obj.name = post.name;
                            obj.url = post.url;
                            obj.category = urls[0].url;
                            res(obj);
                        });
                    }));
                });
                Promise.all(promises).then(function(goodies)
                {
                    resolve(goodies);
                });
            });
        });
    },


    /**
     * TODO
     * @returns {*|Promise}
     */
    getPopularPosts: function()
    {
        return new Promise(function(resolve, reject)
        {
            var q = "select * from popular_posts";
            fetch(q).then(function(sqlPosts)
            {

            });
        });
    },
    /**
     * Function which checks to see if a user successfully logged in based on
     * the post data which they sent
     *
     * @param postData the post data
     * @return {*|Promise} a json object with {pass: , user: }
     * the pass is whether or not they logged in successfully and the user is
     * the username they successfully logged in with
     */
    checkLogin: function(postData)
    {
        var post = qs.parse(postData);
        return new Promise(function(resolve, reject)
        {
            var result = Object();
            result.pass = false;

            if(post.username && post.password)
            {
                var cleanName = sanitizer.sanitize(post.username);
                var cleanPassword = sanitizer.sanitize(post.password);

                var getSalt = "select * from users where user_name='" +
                    cleanName + "'";
                fetch(getSalt).then(function(saltResult)
                {
                    if(saltResult.length == 1)
                    {
                        var hashedPassword = crypto.createHash('sha256')
                            .update(cleanPassword + saltResult[0].salt)
                            .digest('hex');
                        if(saltResult[0].password === hashedPassword)
                        {
                            result.pass = true;
                            result.user = cleanName;
                            resolve(result);
                        }
                        else
                        {
                            resolve(result)
                        }
                    }
                    else
                    {
                        //incorrect username
                        resolve(result);
                    }
                })
            }
            else
            {
                //no login attempts were made
                resolve(result);
            }
        });
    },

    /**
     * Fetches a promise containing every post in the database
     * @returns {Array}
     */
    getAllPosts: function()
    {
        return fetch("select * from posts order by published desc");
    },


    /**
     * Fetches the sql category information based on it's id
     * @param categoryId
     * @returns {Array}
     */
    getCategory: function(categoryId)
    {
        return fetch("select * from categories where category_id='"
            + categoryId + "'");
    },


    /**Returns download information associated with a download name
     *
     * @param downloadURL
     * @returns {Array}
     */
    getDownload: function(downloadURL)
    {
        var cleanD = sanitizer.sanitize(downloadURL);
        var q = "select * from downloads where name='" + cleanD + "' limit 1";

        return new Promise(function(resolve, reject)
        {
           fetch(q).then(function(sqlData)
           {
               return module.exports.incrementDownloadCount(sqlData);
           }).then(function(sqlData)
           {
               resolve(sqlData)
           }).catch(function(error)
           {
               reject(error);
           })
        });
    },


    /** Increments the download count in the database
     *
     * @param sqlRow
     * @returns {*|Promise}
     */
    incrementDownloadCount: function(sqlRow)
    {
        return new Promise(function(resolve, reject)
        {
            if(sqlRow.length == 1)
            {
                var q = "update downloads set download_count='" +
                    (sqlRow[0].download_count + 1) + "' where download_id='" +
                    sqlRow[0].download_id + "'";
                console.log(q);
                module.exports.insert(q).then(function(r)
                {
                    resolve(sqlRow);
                }).catch(function(err)
                {
                    reject(err);
                })
            }
            else
            {
                resolve(sqlRow);
            }
        });
    },


    /**
     * Fetches all the downloads from the database
     *
     * @returns {Array}
     */
    getAllDownloads: function()
    {
        return fetch("select * from downloads");
    },


    /**
     * Inserts a download row into the database
     *
     * @param name of the download
     * @param file name of file
     * @returns {*|the}
     */
    addDownload: function(name, file)
    {
        var q = "insert into downloads (name, file, download_count) " +
            "values('" + name + "', '" + file + "', '0')";

        return module.exports.insert(q);
    },

    /**
     * Based on the post data submitted by the user this function updates
     * the information on the post in the database
     * @param postData
     * @returns {*|the}
     */
    editPost: function(postData)
    {
        var url = postData.edit_name_new.split(" ").join("-").toLowerCase();
        var q = "update posts ";
        q+= "set category_id='" + postData.edit_cat_num + "' ";
        q+= ",name='" + postData.edit_name_new + "' ";
        q+= ",url='" + url + "' ";
        q+= ",picture_url='" + postData.edit_pic + "' ";
        q+= ",published='" + postData.edit_date + "' ";
        q+= " where post_id='" + postData.edit_post_2 + "'";
        return module.exports.insert(q);
    },

    /**
     * Function which returns a promise which contains the string of the
     * entire sitemap for the blog.
     * @returns {Promise|*}
     */
    getSiteMap: function()
    {
        return new Promise(function(resolve, reject)
        {
            var base = "http://jrtechs.net/";
            var sm = base + "\n";
            var promises = [];
            module.exports.getCategories().then(function(categories)
            {
                categories.forEach(function(cat)
                {
                    promises.push(new Promise(function(res, rej)
                    {
                        sm += base + "category/" + cat.url + "\n";

                        module.exports.getPostsFromCategory(cat.url).then(function(posts)
                        {
                            posts.forEach(function(post)
                            {
                                sm += base + cat.url + "/" + post.url + "\n";
                            });
                            res()
                        })
                    }));
                });

                Promise.all(promises).then(function()
                {
                    resolve(sm);
                }).catch(function(error)
                {
                    throw error;
                });

            });

        });
    }
};