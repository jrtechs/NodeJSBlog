const fs = require('fs');

const sql = require('../utils/sql');

module.exports=
{

    main: function()
    {
        sql.getSiteMap().then(function(result)
        {
            var buf = Buffer.from(result, 'utf8');

            var path = '../sitemap.txt';
            fs.open(path, 'w', function(error, fd)
            {
                if(error)
                    throw 'could not open file: ' + error;

                fs.write(fd, buf, 0, buf.length, null, function(err)
                {
                   if(err)
                       throw "error writing file: " + err;

                   fs.close(fd, function()
                   {
                       console.log("Updated Sitemap");
                   })
                });
            });
        });
    }
}

