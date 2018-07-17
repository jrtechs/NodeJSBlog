const utils = require('../utils/utils.js');
const crypto = require('crypto');

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

            var img = cache.get(fileName);
            if(img == null)
            {
                utils.include("." + fileName).then(function(content)
                {
                    var eTag = crypto.createHash('md5').update(img).digest('hex');
                    result.writeHead(200, {'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=2678400', 'ETag': '"' + eTag + '"'});
                    result.write(content);
                    result.end();
                    cache.put(content);
                });
            }
            else
            {
                var eTag = crypto.createHash('md5').update(img).digest('hex');
                result.writeHead(200, {'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=2678400', 'ETag': '"' + eTag + '"'});
                result.write(img);
                result.end();
            }
        }
    };