const utils = require('../utils/utils.js');

module.exports=
{
    main: function(res, fileName)
    {
        utils.include(res,"includes/sidebar.html");
    }
};