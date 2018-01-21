const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword"
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
        con.connect(function(err)
        {
            if (err) throw err;
            con.query(sqlStatement, function (err, result)
            {
                if (err) throw err;
                return result;
            });
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
    }
};