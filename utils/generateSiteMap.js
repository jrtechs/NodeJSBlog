const fs = require('fs');

const sql = require('../utils/sql');

var stream = fs.createWriteStream("../sitemap.txt");

stream.once('open', function(fd)
{
    sql.getSiteMap().then(function(result)
    {
        stream.write(result);
    }).then(function()
    {
        stream.end();
    }).catch(function(err)
    {
        console.log(err);
    });
});