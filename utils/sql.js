const mysql = require('mysql');

const sanitizer = require('sanitizer');

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

module.exports=
{
    /**
     * Function used to query the database for records
     *
     * @param sqlStatement
     * @returns {Array}
     */
    fetch : function(sqlStatement)
    {
        con.query(sqlStatement, function (err, result)
        {
            if (err) throw err;
            return result;
        });

        return [];
    },
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
        con.query(sanitizer.sanitize(sqlStatement), function (err, result)
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
        var splitURL = requestURL.split("/");
        var result_category = this.fetch("select * from categories " +
            "where url='" + splitURL[1] + "'");
        if(result_category.length != 0)
        {
            var result_posts = this.fetch("select * from posts where" +
                "category_id='" + result_category[0].category_id + "' " +
                "and url='" + splitURL[2] + "'");
            if(result_posts.length != 0)
            {
                return result_posts[0];
            }
        }
        return 0;
    }
};