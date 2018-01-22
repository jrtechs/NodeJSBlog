/**
 Utilities is a node modules created to make tasks like
 including html files easier for me programming.
 */

const fs = require('fs');

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
        try
        {
            result.write(fs.readFileSync(fileName));
        }
        catch (e)
        {
            console.log("Could not find " + fileName);
        }

    },

    /**
     * Function which is responsible for returning all post data.
     *
     * @param request sent by user in initial server call
     * @return the post data
     */
    getPostData: function(request)
    {
        console.log("Get post data method");
        if(request.method == 'POST')
        {
            var body = '';

            request.on('data', function (data)
            {
                body += data;

                //Kills request, don't steal my RAM!!
                //You can only download so much ram ;)
                if (body.length > 1e6)
                    request.connection.destroy();
            });

            request.on('end', function ()
            {
                console.log(body);
                return body;
            });
        }
        return {};
    }
};