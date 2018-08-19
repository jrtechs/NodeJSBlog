/**
 Utilities is a node modules created to make tasks like
 including html files easier for me programming.
 */

const Promise = require('promise');

const utils = require('../utils/utils.js');

const sql = require('../utils/sql');

module.exports=
    {
        /**
         *
         * @param res
         * @param requestURL
         * @param request
         * @returns {*|Promise}
         */
        main: function(res, requestURL)
        {
            return new Promise(function(resolve, reject)
            {
                const urlSplit = requestURL.split("/");
                console.log(urlSplit);
                if(urlSplit.length == 3 || urlSplit.length == 4)
                {
                    console.log(urlSplit[2]);
                    sql.getDownload(urlSplit[2]).then(function(result)
                    {
                        console.log(result);
                        if(result.length == 1)
                        {
                            const file = './downloads/content/' + result[0].file;
                            res.download(file);
                        }
                        else
                        {
                            utils.print404(res).then(function()
                            {
                                resolve();
                            })
                        }
                    });
                }
                else
                {
                    utils.print404().then(function(content)
                    {
                        resolve(content);
                    })
                }
            });
        }
    };