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
     * @param fileName the file to append to the result
     */
    include: function(fileName)
    {
        return new Promise(function(resolve, reject)
        {
            try
            {
                resolve(fs.readFileSync(fileName));
            }
            catch (e)
            {
                console.log("Could not find " + fileName);
                resolve("");
            }
        });
    },


    /**
     * Method which return the contents of a file as a string
     * @param fileName
     * @return {*}
     */
    getFileContents: function(fileName)
    {
        try
        {
            return fs.readFileSync(fileName);
        }
        catch (e)
        {
            console.log("Could not find " + fileName);
        }
        return 0;
    },


    /**
     *
     * @param fileName
     * @return {*}
     */
    getFileLine: function(fileName)
    {
        try
        {
            return fs.readFileSync(fileName, "utf8").split('\n').join('');
        }
        catch (e)
        {
            console.log("Could not find " + fileName);
        }
        return 0;
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
                    resolve(body);
                });
            }
            else
            {
                resolve(0);
            }
        });
    },


    /**
     * Displays 404 error to user
     *
     * @param result
     * @returns {*}
     */
    print404: function()
    {
        return this.include("includes/404.html");
    },


    /**
     * Displays 404 error to user
     *
     * @param result
     * @returns {*}
     */
    printWrongHost: function()
    {
        return this.include("includes/incorrectHost.html");
    }
};