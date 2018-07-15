const fs = require('fs');

const sql = require('../utils/sql');

module.exports=
{

    /**
     * Function which is responsible for writing the sitemap
     * to ../sitemap.txt
     */
    main: function()
    {
        sql.getSiteMap().then(function(result)
        {
            console.log(result);
            fs.writeFile("./sitemap.txt", result, function(err)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("sitemap updated");
                }
            });
        });
    }
}

