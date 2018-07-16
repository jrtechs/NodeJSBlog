const utils = require('../utils/utils.js');

module.exports=
    {
        /**Sends the user an image from the specified fileName.
         *
         * @param result
         * @param fileName
         */
        main: function(result, fileName, cache)
        {
            //result.contentType = 'image/png';
            result.writeHead(200, {'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=604800'});

            var img = cache.get(fileName);
            if(img == null)
            {
                utils.include("." + fileName).then(function(content)
                {
                    result.write(content);
                    result.end();
                    cache.put(content);
                });
            }
            else
            {
                result.write(img);
                result.end();
            }
        }
    };