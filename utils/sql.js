const mysql = require('mysql');

const sanitizer = require('sanitizer');

var Promise = require('promise');

const con = mysql.createConnection({
    host: "localhost",
    user: "blog_user",
    password: "password",
    database: "blog_name"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
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
    }
};