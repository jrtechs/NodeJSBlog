/**
 Utilities is a node modules created to make tasks like
 including html files easier for me programming.
 */

const fs = require('fs');

var Promise = require('promise');

module.exports=
{
    /**
     * A function similar to the include statement in PHP
     * This function writes a file to the output
     *
     * @param result the result that is sent to the user from node
     * @param fileName the file to append to the result
     */
    include: function(result, fileName)
    {
        return new Promise(function(resolve, reject)
        {
            try
            {
                result.write(fs.readFileSync(fileName));
            }
            catch (e)
            {
                console.log("Could not find " + fileName);
            }
            resolve();
        });
    },

    /**
     * Function which is responsible for returning all post data.
     *
     * @param request sent by user in initial server call
     * @return the post data
     */
    getPostData: function(req)
    {
        return new Promise(function(resolve, reject)
        {
            if(req.method == 'POST')
            {
                var body = '';

                req.on('data', function (data)
                {
                    body += data;

                    //Kills request, don't steal my RAM!!
                    //You can only download so much ram ;)
                    if (body.length > 1e6)
                    {
                        req.connection.destroy();
                        reject();
                    }

                });

                req.on('end', function ()
                {
                    console.log(body);
                    resolve(body);
                });
            }
            else
            {
                resolve(0);
            }
        });
    }
};