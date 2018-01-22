const utils = require('../utils/utils.js');
var Promise = require('promise');



module.exports=
{
    main: function(result, fileName, request)
    {
        return new Promise(function(resolve, reject){
            var promiseToGetPost = function(req)
            {
                return new Promise(function(resolve, reject)
                {
                    if(req.method == 'POST')
                    {
                        var body = '';

                        req.on('data', function (data)
                        {
                            body += data;

                            //Kills request, don't steal my RAM!!
                            //You can only download so much ram ;)
                            if (body.length > 1e6)
                            {
                                req.connection.destroy();
                                reject();
                            }

                        });

                        req.on('end', function ()
                        {
                            console.log(body);
                            resolve(body);
                        });
                    }
                    else
                    {
                        resolve(0);
                    }
                });

            };
            var promiseToDisplayContents = function(postData)
            {
               return require("../admin/addCategory.js").main(result, postData);
            };

            promiseToGetPost(request).then(function (postData)
            {
                return promiseToDisplayContents(postData);
            }).then(function()
            {
                resolve();
            });
        });
    }
};