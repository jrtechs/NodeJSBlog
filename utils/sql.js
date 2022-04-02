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
const config = require('../utils/utils').getConfig();

const sqlite3 = require('sqlite3').verbose();
const con = new sqlite3.Database('./blog.db');


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
        
        con.all(sanitizer.sanitize(sqlStatement), function (err, result)
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
 * Function used to use insert statements into the database
 *
 * Don't worry, the input gets sanitized
 *
 * @param sqlStatement
 * @return the id of the new record - if there is one
 */
const insert = function(sqlStatement)
{
    return new Promise(function(resolve, reject)
    {
        con.exec(sanitizer.sanitize(sqlStatement), function (err, result)
        {
            if (err)
            {
                console.log(err);
                reject();
            }
            resolve(0);
        });
    })
};


/**
 * Helper function to generate a hashed password
 * from a given plain text password.
 *
 * This uses 64 bits of entropy as the random salt
 * and uses sha256 hashing method to hash the password
 * combined with the salt.
 *
 * @param password
 * @returns {Object pass: hashedPassword, salt: salt used to hash}
 */
const createHashedPassword = function(password)
{
    const randBuff = crypto.randomBytes(64);

    const salt = crypto.createHash('sha256').update(randBuff).digest('hex');

    const hashPass = crypto.createHash('sha256')
        .update(password + salt)
        .digest('hex');

    var hashPassObject = new Object();
    hashPassObject.pass = hashPass;
    hashPassObject.salt = salt;

    return hashPassObject;
};


module.exports=
{
    /**
     * function which fetches the sql info on a post based on it's sql id
     * @param id
     * @returns {Array}
     */
    getPostById: function(id)
    {
        return new Promise((resolve, reject)=>
        {
            fetch("select * from posts where post_id='" + id + "' limit 1")
                .then(function(post)
            {
                if(post.length === 1)
                {
                    resolve(post[0]);
                }
                else
                {
                    reject();
                }
            }).catch((error)=>
            {
                reject(error);
            });
        });
    },

    getPostIds: function(categoryID)
    {
        var q = categoryID == 0 ? "select post_id from posts order by published desc" : 
            "select post_id from posts where category_id='" + categoryID + "' order by published desc";
        return fetch(q);
    },

    insert: function(sqlStatement)
    {
        return insert(sqlStatement);
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
            if(splitURL.length >= 1)
            {
                var q = "SELECT posts.post_id, posts.pinned, posts.name, posts.url, posts.category_id, posts.published, posts.picture_url FROM categories INNER JOIN posts on categories.category_id=posts.category_id and categories.url='" + splitURL[1] + "' AND posts.url='" + splitURL[2] + "'";
                fetch(q).then(function (sql_res)
                {
                    if(sql_res.length != 0)
                    {
                        resolve(sql_res);
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
    },


    /**
     * Function used to retrieve all categories when making the sidebar
     *
     * @return {Promise<Response> | * | Array}
     */
    getCategories : function()
    {
        const q = "SELECT * FROM categories ORDER BY name";
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
        var q = "SELECT posts.post_id, posts.pinned, posts.name, posts.url, posts.category_id, posts.published, posts.picture_url FROM categories INNER JOIN posts on categories.category_id=posts.category_id and categories.url='" + requestURL + "' order by posts.published desc";
        return fetch(q);
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
    getRecentPosts: function(limit)
    {
        limit = (limit == null) ? 10 : limit;
        var q = "select posts.name, posts.url, posts.published, posts.category_id, categories.url as category from posts INNER JOIN categories on posts.category_id=categories.category_id order " +
            "by post_id desc limit " + limit;
        return fetch(q);
    },


    /**
     * Returns a list of all the pinned posts in the database.
     *
     * @returns {Promise}
     */
    getPinnedPosts: function()
    {
        return fetch("select posts.name, posts.url, posts.category_id, categories.url as category from posts INNER JOIN categories on posts.category_id=categories.category_id where pinned=1 order by post_id desc");
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

    getAllUsers: function()
    {
        return fetch("select * from users");
    },

    getUserByID: function(userID)
    {
        const cleanID = sanitizer.sanitize(userID);

        const q = "select * from users where user_id='" + cleanID + "'";

        return fetch(q);
    },



    removeUser: function(user_id)
    {
        const cleanID = sanitizer.sanitize(user_id);

        return insert("delete from users where user_id='" + cleanID + "'");
    },

    addUser: function(username, password)
    {
        const cleanName = sanitizer.sanitize(username);
        const cleanPassword = sanitizer.sanitize(password);
        const hashedPassword = createHashedPassword(cleanPassword);

        const q = "insert into users(user_name, password, salt) values('" + cleanName + "'," +
            "'" + hashedPassword.pass +  "','" + hashedPassword.salt + "')";

        return insert(q);
    },


    updateUser: function(userID, username, password)
    {
        const cleanID = sanitizer.sanitize(userID);
        const cleanName = sanitizer.sanitize(username);
        const cleanPassword = sanitizer.sanitize(password);
        const hashedPassword = createHashedPassword(cleanPassword);

        const q = "update users " +
                "set user_name='" + cleanName + "'" +
                ",password='" + hashedPassword.pass + "'" +
                ",salt='" + hashedPassword.salt + "'" +
                " where user_id='" + cleanID + "'";

        return insert(q);
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
                insert(q).then(function(r)
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

        return insert(q);
    },


    /**
     *
     * @param id
     */
    removeDownload: function(id)
    {
        const q = "delete from downloads where download_id='" + id + "'";

        return insert(q);
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

        return insert(q);
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
    }
};