/**
 * Boated file which handles all the SQL
 * queries ran by the server
 *
 * @author Jeffery Russell
 */

const mysql = require('mysql');

/** Sanitizer to clean user inputs and prevent SQL injections */
const sanitizer = require('sanitizer');

/** Crypto package used for hashing */
const crypto = require('crypto');

/** Used to parse post data */
const qs = require('querystring');

/** Used to load the config file from the disk */
const config = require('../utils/configLoader').getConfig();

/** SQL connection */
const con = mysql.createConnection({
    host: config.SQL_HOST,
    user: config.SQL_USER,
    password: config.SQL_PASSWORD,
    database: config.SQL_DATABASE
});

con.connect(function(err) {
    if (err)
        console.log(err);
});


/**
 * Function used to query the database for records
 *
 * @param sqlStatement
 * @returns {Array}
 */
const fetch = function(sqlStatement)
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


/**
 * Helper function which fetches the category url for all the
 * posts returned in the posts table and appends them to the
 * posts json objects.
 *
 * @param sqlPosts
 * @returns {Promise}
 */
const fetchWithCategoryInformation = function(sqlPosts)
{
    return new Promise(function(resolve, reject)
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
                    reject();
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
                        resolve(result_posts);
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
     * Function which currently returns all blog of a particular
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
        return fetch("select * from posts order by post_id desc");
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
                fetchWithCategoryInformation(sqlPosts).then(function(data)
                {
                    resolve(data);
                })
            });
        });
    },


    /**
     * Returns a list of all the pinned posts in the database.
     *
     * @returns {Promise}
     */
    getPinnedPosts: function()
    {
        return new Promise(function(resolve, reject)
        {
            var q = "select name,url, category_id from posts where pinned=1 order " +
                "by post_id desc limit 10";
            fetch(q).then(function(sqlPosts)
            {
                fetchWithCategoryInformation(sqlPosts).then(function(data)
                {
                    resolve(data);
                })
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
        const post = qs.parse(postData);
        return new Promise(function(resolve, reject)
        {
            var result = Object();
            result.pass = false;

            if(post.username && post.password)
            {
                const cleanName = sanitizer.sanitize(post.username);
                const cleanPassword = sanitizer.sanitize(post.password);

                const getSalt = "select * from users where user_name='" +
                    cleanName + "'";
                fetch(getSalt).then(function(saltResult)
                {
                    if(saltResult.length == 1)
                    {
                        const hashedPassword = crypto.createHash('sha256')
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
        const q = "insert into downloads (name, file, download_count) " +
            "values('" + name + "', '" + file + "', '0')";

        return module.exports.insert(q);
    },


    /**
     *
     * @param id
     */
    removeDownload: function(id)
    {
        const q = "delete from downloads where download_id='" + id + "'";

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
        const url = postData.edit_name_new.split(" ").join("-").toLowerCase();

        console.log(postData);

        var pinned = ("pinned_checkbox" in postData) == false ? "NULL": "1";
        console.log(pinned);

        const q = "update posts " +
                    "set category_id='" + postData.edit_cat_num + "' " +
                    ",name='" + postData.edit_name_new + "' " +
                    ",url='" + url + "' " +
                    ",picture_url='" + postData.edit_pic + "' " +
                    ",published='" + postData.edit_date + "' " +
                    ",pinned=" + pinned+
                    " where post_id='" + postData.edit_post_2 + "'";

        console.log(q);

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
            const base = "http://jrtechs.net/";

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
    },


    /**
     * Logs visited page for backend server analytics.
     *
     * @param ip
     * @param page
     */
    logTraffic: function(ip, page)
    {
        if(page.length > 40)
        {
            console.log("Error, request too long to log ip:"
                + ip + " page: " + page);
            return;
        }

        if(ip.length > 20)
        {
            ip = "";
        }

        const q = "insert into traffic_log (url, ip, date) values " +
            "('" + page + "', '" + ip + "', now())";

        module.exports.insert(q);
    }
};