const mysql = require('mysql');

const sanitizer = require('sanitizer');

const Promise = require('promise');

const crypto = require('crypto');

const qs = require('querystring');

const con = mysql.createConnection({
    host: "localhost",
    user: "blog_user",
    password: "password",
    database: "blog_name"
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
        con.query(sqlStatement, function (err, result)
        {
            if (err)
            {
                reject();
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

                    var q2 = "select * from posts where category_id='" + result_category[0].category_id +
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
     * Function which currently returns all posts of a particular category from the database
     * @param requestURL
     * @return {*|Promise}
     */
    getPostsFromCategory: function(requestURL)
    {
        return new Promise(function(resolve, reject)
        {
            var q = "select * from categories where name ='" + requestURL + "' limit 1";
            fetch(q).then(function(categories)
            {
                if(categories.length != 0)
                {
                    var qPosts = "select * from posts where category_id='" + categories[0].category_id + "'";
                    resolve(fetch(qPosts));
                }
                else
                {
                    resolve(0);
                }
            });
            resolve(0);
        });
    },

    /**
     * Helper method which returns a list of objects which contains the url and name of thee ten most recent posts
     *
     * {[name: , url: ],[name: , url: ],[name: , url: ],...}
     *
     * @return {*|Promise}
     */
    getRecentPosts: function()
    {
        return new Promise(function(resolve, reject)
        {
            var q = "select name,url, category_id from posts order by post_id desc limit 10";
            fetch(q).then(function(sqlPosts)
            {
                var promises = [];
                sqlPosts.forEach(function(post)
                {
                    promises.push(new Promise(function(res, rej)
                    {
                        var getCategory = "select url from categories where category_id='" + post.category_id + "'";
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

                var getSalt = "select * from users where user_name='" + cleanName + "'";
                fetch(getSalt).then(function(saltResult)
                {
                    if(saltResult.length == 1)
                    {
                        var hashedPassword = crypto.createHash('sha256')
                            .update(cleanPassword + saltResult[0].salt)
                            .digest('hex');
                        if(saltResult[0].password === hashedPassword)
                        {
                            //yay!
                            result.pass = true;
                            result.user = cleanName;
                            resolve(result);
                        }
                        else
                        {
                            //wrong password
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
    }
};