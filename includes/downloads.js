/**
 Utilities is a node modules created to make tasks like
 including html files easier for me programming.
 */

const pageBuilder = require('../utils/pageBuilder');

//DB query
const sql = require('../utils/sql');


module.exports=
    {
        /**
         * Processes download url and sends download to user if it
         * exists in the database.
         *
         * @param res
         * @param requestURL
         * @returns {*|Promise}
         */
        main: function(res, requestURL)
        {
            const urlSplit = requestURL.split("/");
            if(urlSplit.length == 2 || urlSplit.length == 4)
            {
                sql.getDownload(urlSplit[1]).then(function(result)
                {
                    if(result.length == 1)
                    {
                        const file = './content/downloads/' +
                            result[0].file;
                        res.download(file);
                    }
                    else
                    {
                        pageBuilder.print404(res);
                    }
                });
            }
            else
            {
                pageBuilder.print404(res);
            }
        }
    };