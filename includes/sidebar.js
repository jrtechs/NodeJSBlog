const utils = require('../utils/utils.js');

module.exports=
{
    main: function(res, fileName)
    {
        return utils.include(res,"includes/sidebar.html");
    }
};