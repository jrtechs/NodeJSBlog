var Promise = require('promise');
const sql = require('../utils/sql');

module.exports=
{
    main: function(res, fileName)
    {
        return new Promise(function(resolve, reject)
        {
            sql.getCategories().then(function(categories)
            {
                console.log(categories);
                for(var category in categories)
                {
                    res.write(category);
                }
            }).then(function())
            {
                resolve();
            }
        });
    }
};