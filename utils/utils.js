/**
 Utilities is a node modules created to make tasks like
 including html files easier for me programming.
 */

const fs = require('fs');

module.exports=
{
    include: function(res, fileName)
    {
        try
        {
            res.write(fs.readFileSync(fileName));
        }
        catch (e)
        {
            console.log("Could not find " + fileName);
        }

    }
};