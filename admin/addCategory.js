const utils = require('../utils/utils.js');
const sql = require('../utils/sql');

module.exports=
{
    main: function(res)
    {
        utils.include(res, "./admin/addCategory.html");
    }
};