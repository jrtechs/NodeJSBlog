/**
 Utilities is a node modules created to make tasks like
 including html files easier for me programming.
 */

//used for file io
const fs = require('fs');

const includes = require("../includes/includes");


module.exports=
{



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
        return '';
    },


    /**
     *
     * @param fileName
     * @returns {any}
     */
    getFileAsJSON: function(fileName)
    {
        return JSON.parse(fs.readFileSync(fileName, 'utf8'));
    },


    /**
     * Returns all the contents of a file as a single line
     * with no break lines.
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
        return '';
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
    print404: function(result)
    {
        includes.include("includes/html/404.html").then(function(html)
        {
            result.write(html);
            result.end();
        })

    }
};