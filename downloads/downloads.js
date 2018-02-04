/**
 Utilities is a node modules created to make tasks like
 including html files easier for me programming.
 */

const fs = require('fs');

var Promise = require('promise');

const utils = require('../utils/utils.js');

const sql = require('../utils/sql');

module.exports=
    {
        main: function(res, requestURL, request)
        {
            res.setHeader('Content-disposition', 'attachment; filename=dramaticpenguin.MOV');
            return new Promise(function(resolve, reject)
            {
                var urlSplit = requestURL.split("/");
                console.log(urlSplit);
                if(urlSplit.length == 3 || urlSplit.length == 4)
                {
                    sql.getDownload(urlSplit[2]).then(function(result)
                    {
                        console.log(result);
                        if(result.length == 1)
                        {
                            var file = './downloads/content/' + result[0].file;
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
                    utils.print404(res).then(function()
                    {
                        resolve();
                    })
                }
            });
        }
    };