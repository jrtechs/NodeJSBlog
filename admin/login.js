const utils = require('../utils/utils.js');
const Promise = require('promise');

module.exports=
    {
        main: function(result, request)
        {
            utils.include(result, './admin/login.html');
            return this.processLogin(result, request);
        },
        processLogin: function(result, request)
        {
            return new Promise(function(resolve, reject)
            {
                resolve();
            });
        }
    };