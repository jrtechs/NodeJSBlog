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
    console.log("sql fetch method called");
    return new Promise(function(resolve, reject)
    {

        con.query(sqlStatement, function (err, result)
        {
            if (err)
            {
                console.log(err);
                reject();
            }
            console.log("sql statement method");
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
        con.query((sqlStatement), function (err, result)
        {
            if (err)
            {
                console.log(err);
                return 0;
            }
            return result.insertId;
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
            var splitURL = requestURL.split("/");
            var q = "select * from categories where url='" + splitURL[1] + "'";
            fetch(q).then(function (result_category)
            {
                console.log(result_category);
                if(result_category.length != 0)
                {

                    q = "select * from posts where category_id='" + result_category[0].category_id + "'  and url='" + splitURL[2] + "'";
                    console.log(q);
                    fetch(q).then(function (result_posts)
                    {
                        console.log(result_posts);
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
    }
};