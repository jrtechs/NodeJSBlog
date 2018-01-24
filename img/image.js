const utils = require('../utils/utils.js');

module.exports=
    {
        /**Sends the user an image from the specified fileName.
         *
         * @param result
         * @param fileName
         */
        main: function(result, fileName)
        {
            result.contentType = 'image/png';
            utils.include(result, "." + fileName);
            result.end();
        }
    };