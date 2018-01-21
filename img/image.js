const utils = require('../utils/utils.js');

module.exports=
    {
        main: function(res, fileName)
        {
            path = "." + fileName;

            res.contentType = 'image/png';
            utils.include(res, path);
            res.end();
        }
    };