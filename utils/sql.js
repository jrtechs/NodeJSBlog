const mysql = require('mysql');

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
     * @param sqlStatement
     * @return the id of the new record - if there is one
     */
    insert : function(sqlStatement)
    {
        con.connect(function(err)
        {
            if (err) throw err;
            con.query(sqlStatement, function (err, result)
            {
                if (err) throw err;
                return result.insertId;
            });
        });
        return 0;
    },

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